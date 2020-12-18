<template>
  <div>
    <div class="ebook-reader" :style="{ width: getWidth() }">
      <div id="read"></div>
    </div>
    <div ref="viewer" v-viewer v-show="false">
      <img :src="img.src" :alt="img.alt" />
    </div>
  </div>
</template>

<script>
  import Epub from 'epubjs'
  import { mapMutations } from 'vuex'
  import { throttle } from '@/util/read'
  import styleURL from '@/assets/styles/read.scss'

  export default {
    name: 'EbookReader',
    data() {
      return {
        book: this.$store.state.read.book,
        img: {
          src: null,
          alt: null
        }
      }
    },
    computed: {},
    methods: {
      ...mapMutations(['updateBook', 'refreshLocation']),
      getWidth() {
        // 根据文档，在使用显示比例缩放的系统上，scrollLeft可能会为您提供一个十进制值。
        // 这导致了可能错误的移动位置
        // 这里将显示的宽度限定为8的倍数来解决问题
        const screenWidth = Math.round(document.documentElement.clientWidth)
        const remainder = screenWidth % 8
        return screenWidth - remainder + 'px'
      },
      hide() {},
      show() {},
      prevPage() {
        console.log('上一页')
        if (this.rendition) {
          this.rendition.prev().then(() => {
            // this.refreshLocation()
          })
          this.hide()
        }
      },
      nextPage() {
        console.log('下一页')
        if (this.rendition) {
          this.rendition.next().then(() => {
            // this.refreshLocation()
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
      }, 1000),
      initEpub(book) {
        this.updateBook(book)
        // 指定渲染的位置和方式
        this.rendition = book.renderTo('read', {
          width: '100%',
          height: window.innerHeight,
          // flow: 'paginated',
          manager: 'continuous'
          // snap: true,
          // method: 'default'
        })
        this.initEvent()
        this.rendition.display().then(()=>{
          // 渲染后第一次翻页一定失败，疑似bug
          // 这里自动翻一次解决问题
          this.nextPage()
        })
        book.ready.then(() => {
          // 修改网页title
          document.title = book.package.metadata.title
          // return this.book.locations.generate(750 * (window.innerWidth / 375) * bookState.defaultFontSize / 16)
          return book.locations.generate()
        })
      },
      initEvent() {
        let vueInstance = this
        this.rendition.hooks.content.register(function (contents) {
          // const baseName = contents.cfiBase.match(/\[(.*?)\]/)[1]
          // bookState.navigation.forEach((navItem) => {
          //   if (navItem.href.indexOf(baseName) !== -1) {
          //     const href = navItem.href.match(/\/(.*?)$/)[1]
          //     let id = undefined
          //     if (href.indexOf('#') !== -1) {
          //       id = href.split('#')[1]
          //     }
          //     if (id) {
          //       //得到每个目录的cfi地址
          //       const node = contents.document.getElementById(id)
          //       const cfi = new EpubCFI(node, contents.cfiBase)
          //       navItem.cfi = cfi.toString()
          //     }
          //   }
          // })
          contents.addStylesheet(styleURL)
          const mousewheel = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel'
          contents.document.addEventListener(
            mousewheel,
            (e) => {
              if (e.detail) {
                e.detail > 0 ? vueInstance.nextPage() : vueInstance.prevPage()
              } else {
                e.deltaY > 0 ? vueInstance.nextPage() : vueInstance.prevPage()
              }
            },
            true
          )
          contents.document.querySelectorAll('.duokan-image-single img').forEach((node) => {
            node.style.boxShadow = 'black 0 0 3px'
            node.style.cursor = 'pointer'
            node.style.border = '1px solid white'
            node.onclick = vueInstance.previewImg
          })
        })
        //单击事件
        this.rendition.on('mousedown', (event) => {
          this.timeStart = event.timeStamp
        })
        this.rendition.on('mouseup', (event) => {
          const time = event.timeStamp - this.timeStart
          if (this.hide()) return
          if (event.target.localName === 'a' || event.target.parentNode.localName === 'a') return
          const path = event.path || event.composedPath()
          if (event.target.localName === 'img' && path) {
            const classList = [].concat(...path.map((item) => [].concat.apply([], item.classList)))
            if (classList.findIndex((item) => item === 'duokan-image-single') !== -1) return
          }
          if (time < 200) {
            if (event.screenX - window.screenX > window.innerWidth * 0.75) this.nextPage()
            else if (event.screenX - window.screenX < window.innerWidth * 0.25) this.prevPage()
            else if (event.y < window.innerHeight * 0.75 && event.y > window.innerHeight * 0.25) this.show()
          }
        })
        //箭头翻页,似乎有问题,暂时无法判断
        this.rendition.on('keydown', this.handleKeyDown)
        window.addEventListener('keydown', this.handleKeyDown)
      },
      previewImg(event) {
        this.img.src = event.target.src
        this.img.alt = event.target.alt
        this.$refs.viewer.$viewer.show()
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
  .ebook-reader {
    margin: 0 auto;
  }
</style>
