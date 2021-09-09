<template>
  <v-resize-observer :on-resize="handleResize">
    <div style="width: 100vw; height: 100vh">
      <div id="read" v-hotkey="keymap" :style="{ width: width + 'px', margin: '0 auto' }"></div>
    </div>
  </v-resize-observer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useReadStore } from '@/store/read'
import { throttle } from 'lodash-es'
import { VResizeObserver } from 'vueuc'
import { Contents } from '@/types/epubjs'
import { createBlobUrl } from 'epubjs/src/utils/core'
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
    // 原生实现解压，这里再读取，可以加快读取速度
    readStore.loadEpub('/Test1/OEBPS/content.opf').then(async (book) => {
      console.log(book)
      readStore.getRendition({
        // 预加载
        // manager: 'continuous',
        // manager: new ContinuousViewManager(),
        // stylesheet: createBlobUrl(`@import url('${cssUrl}')`, 'text/css')
      })

      let handleMouseWheel = (e: WheelEvent) => {
        if (e.detail) {
          // Firefox
          e.detail > 0 ? next() : prev()
        } else {
          e.deltaY > 0 ? next() : prev()
        }
      }

      readStore.rendition!.hooks.content.register((content: Contents) => {
        // @ts-ignore
        content.window.addEventListener(mousewheel, handleMouseWheel, true)
        content.window.onload = (e) => console.log(e)
      })

      const location = await readStore.getLocation()
      await readStore.display(location)
      loading.value = false
    })

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
