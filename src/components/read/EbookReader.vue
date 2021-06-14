<template>
  <div v-resize="onResize">
    <div id="read" :style="{ width: width + 'px' }"></div>
    <div ref="viewer" v-viewer v-show="false">
      <img :src="img.src" :alt="img.alt" />
    </div>
    <!-- <div v-show="menuShow || sidebarShow" class="cover" @click="hide"></div> -->
    <div v-show="sidebarShow" class="cover" @click="hide"></div>
    <ebook-menu />
    <ebook-sidebar />
    <font-setting />
    <bg-setting />
    <ebook-search />
  </div>
</template>

<script>
  // import { EpubCFI } from 'epubjs' //这样导不进来，奇怪
  import Epub85 from 'epubjs'
  import EpubLast from '@/assets/js/epub.last'
  import EpubCFI from 'epubjs/src/epubcfi'
  import { mapActions, mapMutations, mapState } from 'vuex'
  import { flatten, GetReadProgress, throttle, ImagePath } from '@/util/read'
  import EbookMenu from '@/components/read/EbookMenu'
  import EbookSidebar from '@/components/read/EbookSidebar'
  import FontSetting from '@/components/read/menu/FontSetting'
  import BgSetting from './menu/BgSetting'
  import { toByteArray } from 'base64-js'
  import md5 from 'md5'
  import { isMobile as IsMobile } from '@/util'
  import handleNote from '@/plugins/note'
  import EbookSearch from '@/components/read/EbookSearch'

  export default {
    name: 'EbookReader',
    components: { EbookSearch, BgSetting, FontSetting, EbookSidebar, EbookMenu },
    data() {
      return {
        img: {
          src: null,
          alt: null
        },
        rendition: null,
        promise: null,
        width: null,
        enableTouch: false,
        touchDetail: null
      }
    },
    props: {
      name: String
    },
    computed: {
      ...mapState('read', ['book', 'menuShow', 'sidebarShow', 'fontSize', 'bookHash']),
      ...mapState('setting', ['epubJsVersion', 'epubJsManager', 'epubJsFlow']),
      navigation() {
        return this.$store.state.read.navigation
      },
      isMobile() {
        return IsMobile()
      },
      Epub() {
        return this.epubJsVersion === 'last.chinese' ? EpubLast : Epub85
      }
    },
    methods: {
      ...mapMutations('read', [
        'updateBook',
        'updateCover',
        'updateNavigation',
        'updateMetadata',
        'updateBookAvailable',
        'updateMenuShow',
        'updateSidebarShow',
        'updateBookHash',
        'updateFontSize'
      ]),
      ...mapActions('read', ['refreshLocation', 'getRendition']),
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
        // if (this.hide()) return
        if (e.target.outerHTML === '<div class="noteCover"></div>') return
        if (e.target.localName === 'a' || e.target.parentNode.localName === 'a') return
        const path = e.path || e.composedPath()
        let X = 0,
          Y = 0
        if (e.type === 'touchend') {
          X = this.touchDetail.targetTouches[0].pageX % this.width
          Y = this.touchDetail.targetTouches[0].pageY
        } else {
          X = e.pageX % this.width
          Y = e.pageY
        }
        if (e.target.localName === 'img' && path) {
          const classList = [].concat(...path.map((item) => [].concat.apply([], item.classList)))
          // 这里对Img的两种特殊情况，需要EPUB制造者进行兼容
          if (classList.includes('duokan-image-single')) {
            if (!this.isInArea(X)) {
              this.previewImg(e)
              return
            }
          }
          if (classList.includes('footnote') || classList.includes('duokan-footnote')) {
            return
          }
        }
        if (time < 200) {
          if (X > this.width * 0.75) this.nextPage()
          else if (X < this.width * 0.25) this.prevPage()
          else if (Y < window.innerHeight * 0.75 && Y > window.innerHeight * 0.25) {
            if (this.menuShow) {
              this.hide()
            } else {
              this.show()
            }
          }
        }
      },
      handleMouseWheel(e) {
        if (e.detail) {
          e.detail > 0 ? this.nextPage() : this.prevPage()
        } else {
          e.deltaY > 0 ? this.nextPage() : this.prevPage()
        }
      },
      isInArea(offsetX) {
        return offsetX > this.width * 0.75 || offsetX < this.width * 0.25
      },
      async initEpub(book, cfi) {
        this.updateBook(book)
        // 指定渲染的位置和方式
        let option = {
          width: this.width,
          height: window.innerHeight,
          manager: this.epubJsManager,
          snap: this.isMobile
        }
        if (this.epubJsFlow !== 'none') option.flow = this.epubJsFlow
        this.rendition = await this.getRendition({
          element: 'read',
          option: option
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
          handleNote(contents.document) // 处理注释
          contents.window.addEventListener(mousewheel, vueInstance.handleMouseWheel, true)
          contents.window.addEventListener('keydown', vueInstance.handleKeyDown)
          if (vueInstance.isMobile) {
            contents.document.addEventListener('touchmove', (e) => {
              if (!vueInstance.enableTouch) {
                vueInstance.enableTouch = true
              }
            })
            contents.document.addEventListener(
              'touchstart',
              (e) => {
                // console.log('touch', e)
                vueInstance.timeStart = e.timeStamp
                vueInstance.touchDetail = e
              },
              true
            )

            contents.document.addEventListener(
              'touchend',
              (e) => {
                // console.log('touchend', e)
                if (!vueInstance.enableTouch) {
                  e.stopPropagation()
                  vueInstance.handleMouseDown(e)
                } else {
                  vueInstance.enableTouch = false
                }
              },
              true
            )
          }
        })
        // 单击事件
        if (!vueInstance.isMobile) {
          this.rendition.on('mousedown', (e) => {
            this.timeStart = e.timeStamp
          })
          this.rendition.on('mouseup', this.handleMouseDown)
        }
        window.addEventListener('keydown', this.handleKeyDown)
      },
      parseBook() {
        this.book.loaded.cover.then((cover) => {
          if (window.device) {
            if (!window.device.fileExits(ImagePath + '/' + this.bookHash)) {
              this.book.archive.getBase64(cover || '/OEBPS/Images/cover.jpg').then((data) => {
                console.log('saveFile')
                window.device.saveFile(this.bookHash, 'Pictures', data)
              })
            }
          }
          this.book.archive.createUrl(cover || '/OEBPS/Images/cover.jpg').then((url) => {
            this.updateCover(url)
          })
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

          let basePath = this.book.package.navPath ? this.book.package.navPath.split('/') : false
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
    mounted() {
      this.getWidth()
      if (window.device) {
        // 连接App调试
        const { updateBookHash, Epub, initEpub } = this
        window.loadBook = function (path, url) {
          let hash = md5(path)
          updateBookHash(hash)
          if (!url.startsWith('/')) {
            console.log('base64')
            let data = toByteArray(url)
            console.log(data.length)
            let book = new Epub()
            book.open(data.buffer).then(() => {
              initEpub(book, GetReadProgress(hash))
            })
          } else if (window.location.origin === 'file://') {
            initEpub(new Epub(url), GetReadProgress(hash))
          } else {
            window.device.readFileBase64(url)
          }
        }
        window.device.readBook()
      } else {
        const { updateBookHash, initEpub, Epub } = this
        const fileName = 'Test2.epub'
        updateBookHash(fileName)
        initEpub(new Epub(fileName), GetReadProgress(fileName))
      }
    }
  }
</script>

<style scoped lang="scss">
  #read {
    margin: 0 auto;
  }

  .cover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
