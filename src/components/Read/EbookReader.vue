<template>
  <div v-resize="onResize">
    <div id="read" :style="{ width: width + 'px' }"></div>
    <div ref="viewer" v-viewer v-show="false">
      <img :src="img.src" :alt="img.alt" />
    </div>
    <div v-show="menuShow || sidebarShow" class="cover" @click="hide"></div>
    <ebook-menu />
    <ebook-sidebar />
    <font-setting />
    <bg-setting />
  </div>
</template>

<script>
  // import { EpubCFI } from 'epubjs' //这样导不进来，奇怪
  // import Epub from 'epubjs'
  import Epub from '@/assets/js/epub.85.fix'
  import EpubCFI from 'epubjs/src/epubcfi'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { flatten, GetReadProgress, throttle, ImagePath } from '@/util/read'
  import EbookMenu from '@/components/Read/EbookMenu'
  import EbookSidebar from '@/components/Read/EbookSidebar'
  import FontSetting from '@/components/Read/Menu/FontSetting'
  import BgSetting from './Menu/BgSetting'
  import { toByteArray } from 'base64-js'
  import md5 from 'md5'

  export default {
    name: 'EbookReader',
    components: { BgSetting, FontSetting, EbookSidebar, EbookMenu },
    data() {
      return {
        img: {
          src: null,
          alt: null
        },
        rendition: null,
        promise: null,
        width: null
      }
    },
    props: {
      uri: String,
      name: String
    },
    computed: {
      ...mapGetters(['book', 'menuShow', 'sidebarShow', 'fontSize']),
      navigation() {
        return this.$store.state.read.navigation
      }
    },
    methods: {
      ...mapMutations([
        'updateBook',
        'updateCover',
        'updateNavigation',
        'updateMetadata',
        'updateBookAvailable',
        'updateMenuShow',
        'updateSidebarShow',
        'updateBookName',
        'updateFontSize'
      ]),
      ...mapActions(['refreshLocation', 'getRendition']),
      hide() {
        this.updateMenuShow(false)
        this.updateSidebarShow(false)
      },
      show() {
        this.updateMenuShow(true)
      },
      prevPage() {
        if (this.rendition && !this.promise) {
          console.log('上一页')
          this.promise = this.rendition.prev().then(() => {
            this.refreshLocation([true, true])
            setTimeout(() => {
              this.promise = null
            }, 30)
          })
          this.hide()
        }
      },
      nextPage() {
        if (this.rendition && !this.promise) {
          console.log('下一页')
          this.promise = this.rendition.next().then(() => {
            this.refreshLocation([true, true])
            setTimeout(() => {
              this.promise = null
            }, 30)
          })
          this.hide()
        }
      },
      handleKeyDown: throttle(function handleKeyDown(e) {
        switch (e.keyCode) {
          case 37: //left
            this.prevPage()
            break
          case 39: //right
            this.nextPage()
            break
        }
      }, 300),
      handleMouseDown(e) {
        const time = e.timeStamp - this.timeStart
        if (this.hide()) return
        if (e.target.localName === 'a' || e.target.parentNode.localName === 'a') return
        const path = e.path || e.composedPath()
        if (e.target.localName === 'img' && path) {
          const classList = [].concat(...path.map((item) => [].concat.apply([], item.classList)))
          if (classList.findIndex((item) => item === 'duokan-image-single') !== -1) return
        }
        if (time < 200) {
          if (e.screenX - window.screenX > this.width * 0.75) this.nextPage()
          else if (e.screenX - window.screenX < this.width * 0.25) this.prevPage()
          else if (e.y < window.innerHeight * 0.75 && e.y > window.innerHeight * 0.25) this.show()
        }
      },
      handleMouseWheel(e) {
        if (e.detail) {
          e.detail > 0 ? this.nextPage() : this.prevPage()
        } else {
          e.deltaY > 0 ? this.nextPage() : this.prevPage()
        }
      },
      async initEpub(book, cfi) {
        this.updateBook(book)
        // 指定渲染的位置和方式
        this.rendition = await this.getRendition({
          element: 'read',
          option: {
            width: this.width,
            height: window.innerHeight,
            // flow: 'auto',
            manager: 'continuous'
            // snap: true,
          }
        })

        this.rendition.display(cfi)

        this.initEvent()
        this.parseBook()
        book.ready
          .then(() => {
            window.device?.setResultOK()
            // 修改网页title
            document.title = book.package.metadata.title
            // return this.book.locations.generate(750 * (window.innerWidth / 375) * bookState.defaultFontSize / 16)
            return book.locations.generate()
          })
          .then(() => {
            // 书籍加载完毕
            this.updateBookAvailable(true)
            this.refreshLocation([true, true])
          })
      },
      initEvent() {
        let vueInstance = this
        const mousewheel = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel'
        this.rendition.hooks.content.register(function (contents) {
          const baseName = contents.cfiBase.match(/\[(.*?)\]/)[1]
          vueInstance.navigation.forEach((navItem) => {
            if (navItem.href.indexOf(baseName) !== -1) {
              const href = navItem.href.match(/\/(.*?)$/)[1]
              let id = undefined
              if (href.indexOf('#') !== -1) {
                id = href.split('#')[1]
              }
              if (id) {
                //得到每个目录的cfi地址
                const node = contents.document.getElementById(id)
                const cfi = new EpubCFI(node, contents.cfiBase)
                navItem.cfi = cfi.toString()
              }
            }
          })
          contents.window.addEventListener(mousewheel, vueInstance.handleMouseWheel, true)
          contents.document.querySelectorAll('.duokan-image-single img').forEach((node) => {
            node.style.boxShadow = 'black 0 0 3px'
            node.style.cursor = 'pointer'
            node.style.border = '1px solid white'
            node.onclick = vueInstance.previewImg
          })
          contents.window.addEventListener('keydown', this.handleKeyDown)
        })
        //单击事件
        this.rendition.on('mousedown', (e) => {
          this.timeStart = e.timeStamp
        })
        this.rendition.on('mouseup', this.handleMouseDown)
        window.addEventListener('keydown', this.handleKeyDown)
      },
      parseBook() {
        this.book.loaded.cover.then((cover) => {
          if (cover) {
            if (window.device) {
              let coverName = md5(this.name)
              if (!window.device.fileExits(ImagePath + '/' + coverName)) {
                this.book.archive.getBase64(cover).then((data) => {
                  console.log('saveFile')
                  window.device.saveFile(coverName, 'Pictures', data)
                })
              }
            }
            this.book.archive.createUrl(cover).then((url) => {
              this.updateCover(url)
            })
          }
        })
        this.book.loaded.metadata.then((metadata) => {
          this.updateMetadata(metadata)
        })
        this.book.loaded.navigation.then((nav) => {
          const navItem = flatten(nav.toc)

          function find(item, levle = 0) {
            return !item.parent
              ? levle
              : find(navItem.filter((parentItem) => parentItem.id === item.parent)[0], ++levle)
          }

          let basePath = this.book.package.navPath?.split('/')
          navItem.forEach((item) => {
            item.level = find(item)
            item.label = item.label.trim()

            if (basePath) {
              if (item.href.startsWith('#')) {
                item.href = this.book.package.navPath + item.href
              } else {
                basePath[basePath.length - 1] = item.href
                item.href = basePath.join('/')
              }
            }
          })
          this.updateNavigation(navItem)
        })
      },
      previewImg(event) {
        this.img.src = event.target.src
        this.img.alt = event.target.alt
        this.$refs.viewer.$viewer.show()
      },
      onResize() {
        if (this.rendition) {
          this.getWidth()
          this.rendition.settings.width = this.width
          this.rendition.resize(this.width, window.innerHeight)
        }
      },
      getWidth() {
        // 根据文档，在使用显示比例缩放的系统上，scrollLeft可能会为您提供一个十进制值。
        // 这导致了可能错误的移动位置
        // 这里将显示的宽度限定为8的倍数来解决问题
        const screenWidth = Math.round(window.innerWidth)
        const remainder = screenWidth % 8
        this.width = screenWidth - remainder
      }
    },
    destroyed() {
      window.removeEventListener('keydown', this.handleKeyDown)
    },
    async mounted() {
      this.getWidth()
      if (this.uri) {
        // 连接App调试
        if (window.device) {
          // 本地文件的路径
          // const filePath = this.path.startsWith('content://') ? this.path : decodeURI(this.path)
          // const temp = filePath.split('/')
          // const fileName = temp[temp.length - 1]
          console.log(this.name)
          this.updateBookName(this.name)
          let data = toByteArray(device.readFile(this.uri))
          console.log(data.length)
          let book = new Epub()
          await book.open(data.buffer)
          this.initEpub(book, GetReadProgress(this.name))
        } else {
          console.log('没有找到device对象')
        }
      } else {
        const fileName = 'Test1.epub'
        this.updateBookName(fileName)
        this.initEpub(new Epub(fileName), GetReadProgress(fileName))
      }
    }
  }
</script>

<style scoped lang="scss">
  #read {
    margin: 0 auto;
  }

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
