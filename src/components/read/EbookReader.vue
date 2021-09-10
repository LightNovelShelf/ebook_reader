<template>
  <v-resize-observer :on-resize="handleResize">
    <div id="read" v-hotkey="keymap" :style="{ width: width + 'px', margin: '0 auto' }"> </div>
    <n-drawer v-model:show="menuShow" :width="200" :height="200" placement="bottom">
      <n-drawer-content title="斯通纳"> 《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。 </n-drawer-content>
    </n-drawer>
  </v-resize-observer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useReadStore } from '@/store/read'
import { throttle } from 'lodash-es'
import { VResizeObserver } from 'vueuc'
import { Contents } from '@/types/epubjs'
// import { createBlobUrl } from 'epubjs/src/utils/core'
// TODO 等vite修#符号的bug
// import ContinuousViewManager from 'epubjs/src/managers/continuous/index.js'

// TODO 这个地方运行没问题，但打包时路径解析的有问题，怀疑也是vite bug
// const cssUrl = new URL('/style/read.css', import.meta.url)
// console.log(cssUrl)

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

export default defineComponent({
  name: 'EbookReader',
  components: {
    VResizeObserver
  },
  props: {
    name: String
  },
  setup() {
    const mousewheel = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel'
    const readStore = useReadStore()
    let next = throttle(readStore.nextPage, 200)
    let prev = throttle(readStore.prevPage, 200)

    let timeStart = 0 as number
    let enableTouch = false
    let touchDetail = null as TouchEvent | null
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
          // TODO
          // this.previewImg(e)
          return
        }
        if (classList.includes('footnote') || classList.includes('duokan-footnote')) return
      }
      if (time < 200) {
        if (X > width.value * 0.75) next()
        else if (X < width.value * 0.25) prev()
        else if (Y < window.innerHeight * 0.75 && Y > window.innerHeight * 0.25) {
          menuShow.value = !menuShow.value
        }
      }
    }

    let handleMouseWheel = (e: WheelEvent) => {
      if (e.detail) {
        // Firefox
        e.detail > 0 ? next() : prev()
      } else {
        e.deltaY > 0 ? next() : prev()
      }
    }

    // 原生实现解压，这里再读取，可以加快读取速度
    readStore.loadEpub('/Test1/OEBPS/content.opf').then(async (book) => {
      console.log(book)
      readStore.getRendition({
        // 预加载
        manager: 'continuous'
        // manager: new ContinuousViewManager(),
        // stylesheet: createBlobUrl(`@import url('${cssUrl}')`, 'text/css'),
        // snap: true,
        // flow: 'paginated'
      })

      readStore.rendition!.hooks.content.register((content: Contents) => {
        // @ts-ignore
        content.window.addEventListener(mousewheel, handleMouseWheel, true)

        if ('ontouchstart' in window) {
          // Mobile
          content.window!.addEventListener(
            'touchmove',
            (e: TouchEvent) => {
              // console.log('touchmove', e)
              enableTouch = true
            },
            true
          )
          content.window!.addEventListener(
            'touchstart',
            (e: TouchEvent) => {
              // console.log('touchstart', e)
              timeStart = e.timeStamp
              touchDetail = e
            },
            true
          )
          content.window!.addEventListener(
            'touchend',
            (e: TouchEvent) => {
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
        } else {
          // PC
          readStore.rendition!.on('mousedown', (e: any) => {
            timeStart = e.timeStamp
          })
          readStore.rendition!.on('mouseup', handleMouseDown)
        }
      })

      const location = await readStore.getLocation()
      await readStore.display(location)
      loading.value = false
    })

    let isInArea = (offsetX: number) => {
      return offsetX > width.value * 0.75 || offsetX < width.value * 0.25
    }

    let menuShow = ref(true)
    let width = ref(0)
    let loading = ref(false)
    width.value = getWidth()

    return {
      width,
      loading,
      // TODO 想法很美好，但实际上用户点击的是iframe里的东西，得想办法把事件传递到父页面
      keymap: {
        enter: next,
        right: next,
        left: prev
      },
      menuShow,
      handleResize(entry: ResizeObserverEntry) {
        // 这个Resize每次翻页都会动，搞不懂
        // console.log(entry)
        width.value = getWidth(entry.contentRect.width)
      }
    }
  }
})
</script>

<style scoped lang="scss"></style>
