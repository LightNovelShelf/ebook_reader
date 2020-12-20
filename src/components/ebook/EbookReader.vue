<template>
  <div v-resize="onResize">
    <div id="read" :style="{ width: width + 'px' }"></div>
    <div ref="viewer" v-viewer v-show="false">
      <img :src="img.src" :alt="img.alt" />
    </div>
    <div v-show="menuShow || sidebarShow" class="cover" @click="hide"></div>
    <ebook-menu />
    <ebook-sidebar />
  </div>
</template>

<script>
  // import Epub from '@/assets/js/epub.fix'
  import Epub from '@/assets/js/epub.min'
  import EpubCFI from 'epubjs/src/epubcfi'
  // import { EpubCFI } from 'epubjs' //这样导不进来，奇怪
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { flatten, throttle } from '@/util/read'
  import styleURL from '@/assets/styles/read.scss'
  import EbookMenu from '@/components/ebook/EbookMenu'
  import EbookSidebar from '@/components/ebook/EbookSidebar'

  export default {
    name: 'EbookReader',
    components: { EbookSidebar, EbookMenu },
    data() {
      return {
        img: {
          src: null,
          alt: null
        },
        rendition: null
      }
    },
    computed: {
      ...mapGetters(['book', 'menuShow', 'sidebarShow']),
      navigation() {
        return this.$store.state.read.navigation
      },
      width() {
        // 根据文档，在使用显示比例缩放的系统上，scrollLeft可能会为您提供一个十进制值。
        // 这导致了可能错误的移动位置
        // 这里将显示的宽度限定为8的倍数来解决问题
        const screenWidth = Math.round(window.innerWidth)
        const remainder = screenWidth % 8
        return screenWidth - remainder
        // return window.innerWidth
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
        'updateSidebarShow'
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
        console.log('上一页')
        if (this.rendition) {
          this.rendition.prev().then(() => {
            this.refreshLocation([true, true])
          })
          this.hide()
        }
      },
      nextPage() {
        console.log('下一页')
        if (this.rendition) {
          this.rendition.next().then(() => {
            this.refreshLocation([true, true])
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
      initEpub(book) {
        this.updateBook(book)
        // 指定渲染的位置和方式
        this.rendition = book.renderTo('read', {
          width: this.width,
          height: window.innerHeight,
          // flow: 'auto',
          manager: 'continuous',
          stylesheet: styleURL
          // snap: true,
        })
        this.rendition.display().then(() => {
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
          // contents.addStylesheet(styleURL)
          const mousewheel = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel'
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
        this.rendition.on('mousedown', (event) => {
          this.timeStart = event.timeStamp
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
          // 无效，不明原因，疑似bug
          this.rendition.settings.width = this.width
          this.rendition.resize(this.width, window.innerHeight)
        }
      }
    },
    destroyed() {
      window.removeEventListener('keydown', this.handleKeyDown)
    },
    mounted() {
      const fileName = 'Test1.epub'
      this.initEpub(new Epub(fileName))
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
