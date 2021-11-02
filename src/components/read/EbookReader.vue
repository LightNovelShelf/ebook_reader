<template>
  <v-resize-observer :on-resize="handleResize">
    <n-spin :show="loading">
      <div id="read" ref="readDom" v-hotkey="keymap" :style="{ width: width + 'px' }"> </div>
      <div ref="viewer" v-viewer v-show="false">
        <img :src="img.src" :alt="img.alt" />
      </div>
    </n-spin>
  </v-resize-observer>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, onUnmounted } from 'vue'
import { useReadStore } from '@/store/read'
import { throttle } from 'lodash-es'
import { VResizeObserver } from 'vueuc'
import { Contents } from '@/types/epubjs'
import { useMenu } from '@/composables/readMenu'
import { getEpubPath } from '@/service'
import 'viewerjs/dist/viewer.css'
import { Viewer } from 'v-viewer'
import readCss from '@/assets/style/read.scss'
import { useBookshelfStore } from '@/store/bookshelf'

function getWidth(width?: number) {
  // 根据文档，在使用显示比例缩放的系统上，scrollLeft可能会为您提供一个十进制值。
  // 这导致了可能错误的移动位置
  // 这里将显示的宽度限定为8的倍数来解决问题
  const screenWidth = Math.round(width || window.innerWidth)
  const remainder = screenWidth % 8
  return screenWidth - remainder
}

function getIframe(ele: any) {
  while (ele.parentNode) {
    ele = ele.parentNode
  }
  for (let iframe of window.document.querySelectorAll('iframe')) {
    if (iframe.contentDocument === ele) return iframe
  }
}

declare interface DomViewer {
  $viewer: Viewer
}

export default defineComponent({
  name: 'EbookReader',
  components: {
    VResizeObserver
  },
  props: {
    path: String
  },
  setup(props) {
    const { menuShow } = useMenu()
    const viewer = ref<DomViewer>()

    const mousewheel = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel'
    const readStore = useReadStore()
    readStore.$reset()
    let next = throttle(readStore.nextPage, 200)
    let prev = throttle(readStore.prevPage, 200)

    let timeStart = 0
    let enableTouch = false
    let touchDetail = null as TouchEvent
    const img = reactive({
      src: '',
      alt: ''
    })
    // 点击事件处理
    let handleMouseDown = (e: any) => {
      const time = e.timeStamp - timeStart
      let target = e.target! as HTMLElement
      if (target.outerHTML === '<div class="noteCover"></div>') return
      if (target.localName === 'a' || (target.parentNode! as HTMLElement).localName! === 'a') return
      const path = (e.path || e.composedPath()) as HTMLElement[]
      const { offsetLeft, offsetTop } = getIframe(target)!.parentNode as HTMLElement
      const { scrollLeft, scrollTop } = document.querySelector('.epub-container') as HTMLElement
      const eventPosition = e.type === 'touchend' ? touchDetail!.targetTouches[0] : e
      const [X, Y] = [offsetLeft + eventPosition.pageX - scrollLeft, offsetTop + eventPosition.pageY - scrollTop]
      if (target.localName === 'img' && path) {
        const classList = path
          .filter((e: HTMLElement) => e.classList)
          .map((item: HTMLElement) => [...item.classList])
          .flat()
        // 这里对Img的两种特殊情况，需要EPUB制作者进行兼容
        if (classList.includes('duokan-image-single') && !isInArea(X)) {
          console.log('previewImg')
          img.src = e.target.src
          img.alt = e.target.alt
          viewer.value.$viewer.show()
          return
        }
        if (classList.includes('footnote') || classList.includes('duokan-footnote')) return
      }
      if (time < 200) {
        if (X > width.value * 0.75) next()
        else if (X < width.value * 0.25) prev()
        else if (Y < window.innerHeight * 0.75 && Y > window.innerHeight * 0.25) {
          menuShow.value = true
        }
      }
    }

    // 滚轮事件处理
    let handleMouseWheel = (e: WheelEvent) => {
      if (e.detail) {
        // Firefox
        e.detail > 0 ? next() : prev()
      } else {
        e.deltaY > 0 ? next() : prev()
      }
    }

    let initEvent = (window: Window) => {
      window.addEventListener(mousewheel, handleMouseWheel, true)
      window.addEventListener('keydown', (e) => {
        let event = new KeyboardEvent('keydown', e)
        window.parent.document.dispatchEvent(event)
      })

      if ('ontouchstart' in window) {
        // Mobile
        window.addEventListener(
          'touchmove',
          () => {
            // console.log('touchmove', e)
            enableTouch = true
          },
          true
        )
        window.addEventListener(
          'touchstart',
          (e: any) => {
            // console.log('touchstart', e)
            timeStart = e.timeStamp
            touchDetail = e
          },
          true
        )
        window.addEventListener(
          'touchend',
          (e: any) => {
            // console.log('touchend', e)
            if (!enableTouch) {
              e.stopPropagation()
              handleMouseDown(e)
            } else {
              enableTouch = false
            }
          },
          true
        )
      }
    }

    let isInArea = (offsetX: number) => {
      return offsetX > width.value * 0.75 || offsetX < width.value * 0.25
    }

    onMounted(async () => {
      // eslint-disable-next-line vue/no-setup-props-destructure
      let path = ''
      let id = null
      if (!props.path || props.path === '') {
        if (process.env.NODE_ENV === 'development') path = './Test2/OEBPS/content.opf'
        // TODO 从原生获取indent路径
        else path = './Test2/OEBPS/content.opf'
      } else {
        // id是文件的md5，每本书唯一
        ;[path, id] = await getEpubPath(props.path)
      }

      let cssUrl = window.location.href.split('#')[0].split('/')
      cssUrl[cssUrl.length - 1] = readCss

      // 原生实现解压，这里再读取，可以加快读取速度
      // 仅限于本地文件，网络文件的跨章节翻页有点问题
      readStore.loadEpub(path, id || path).then(async (book) => {
        console.log(book)
        readStore.getRendition({
          // 预加载
          // manager: 'continuous'
          stylesheet: cssUrl.join('/')
          // snap: true,
          // flow: 'paginated'
        })

        if (!('ontouchstart' in window)) {
          readStore.rendition!.on('mousedown', (e: any) => {
            timeStart = e.timeStamp
          })
          readStore.rendition!.on('mouseup', handleMouseDown)
        }

        readStore.rendition!.hooks.content.register((content: Contents) => {
          initEvent(content.window)
        })

        const location = await readStore.getLocation()
        await readStore.display(location)
        loading.value = false
      })
    })
    onUnmounted(() => {
      const bookshelfStore = useBookshelfStore()
      if (bookshelfStore.moveFunction) {
        bookshelfStore.moveFunction()
      }
    })

    let width = ref(0)
    let loading = ref(true)
    width.value = getWidth()

    return {
      width,
      loading,
      keymap: {
        enter: next,
        right: next,
        left: prev
      },
      img,
      viewer,
      readDom: ref(),
      handleResize(entry: ResizeObserverEntry) {
        // 这个Resize每次翻页都会调用，搞不懂
        // console.log(entry)
        width.value = getWidth(entry.contentRect.width)
      }
    }
  }
})
</script>

<style scoped lang="scss">
#read {
  margin: 0 auto;
  height: 100vh;
}
</style>
