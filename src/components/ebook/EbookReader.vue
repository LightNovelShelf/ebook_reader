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
  </div>
</template>

<script>
  // import { EpubCFI } from 'epubjs' //这样导不进来，奇怪
  import Epub from '@/assets/js/epub.85.fix'
  import EpubCFI from 'epubjs/src/epubcfi'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { flatten, getFontSize, GetReadProgress, throttle } from '@/util/read'
  import READ_STYLE from '@/assets/styles/read.scss'
  import EbookMenu from '@/components/ebook/EbookMenu'
  import EbookSidebar from '@/components/ebook/EbookSidebar'
  import axios from 'axios'
  import FontSetting from '@/components/ebook/Menu/FontSetting'

  export default {
    name: 'EbookReader',
    components: { FontSetting, EbookSidebar, EbookMenu },
    data() {
      return {
        img: {
          src: null,
          alt: null
        },
        rendition: null,
        readStyles: null,
        promise: null,
        width: null
      }
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
      ...mapActions(['refreshLocation']),
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
      initEpub(book, cfi) {
        this.updateBook(book)
        // 指定渲染的位置和方式
        this.rendition = book.renderTo('read', {
          width: this.width,
          height: window.innerHeight,
          // flow: 'auto',
          manager: 'continuous',
          stylesheet: window.URL.createObjectURL(new Blob([this.readStyles], { type: 'text/css' }))
          // snap: true,
        })
        this.loadFontSize()
        this.rendition.display(cfi).then(() => {
          // 只显示一列并且初始渲染第一页的情况下，渲染后第一次翻页一定失败
          // Ubuntu Chrome出现，Firefox正常，需要更多测试
          if (this.rendition._layout.divisor === 1) {
            // this.nextPage()
          }
        })
        this.initEvent()
        this.parseBook()
        book.ready
          .then(() => {
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
          this.book.archive.createUrl(cover).then((url) => {
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
          navItem.forEach((item) => {
            item.level = find(item)
            item.label = item.label.trim()
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
      },
      loadFontSize() {
        let size = getFontSize()
        this.rendition.themes.fontSize(size + 'px')
        this.updateFontSize(size)
      }
    },
    destroyed() {
      window.removeEventListener('keydown', this.handleKeyDown)
    },
    async mounted() {
      this.getWidth()
      this.readStyles = (await axios.get(READ_STYLE)).data
      const fileName = 'Test1.epub'
      this.updateBookName(fileName)
      this.initEpub(new Epub(fileName), GetReadProgress(fileName))
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
