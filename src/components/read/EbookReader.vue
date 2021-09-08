<template>
  <div id="read" v-hotkey.prevent="keymap" :style="{ width: width + 'px', margin: '0 auto' }"></div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useReadStore } from '@/store/read'
import { throttle } from 'lodash-es'

export default defineComponent({
  name: 'EbookReader',
  props: {
    name: String
  },
  setup() {
    const readStore = useReadStore()
    // 原生实现解压，这里再读取，获取可以加快读取速度
    readStore.loadEpub('/Test1/OEBPS/content.opf').then((book) => {
      console.log(book)
      readStore.getRendition()
      readStore.display()
    })
    // TODO 响应
    function getWidth() {
      // 根据文档，在使用显示比例缩放的系统上，scrollLeft可能会为您提供一个十进制值。
      // 这导致了可能错误的移动位置
      // 这里将显示的宽度限定为8的倍数来解决问题
      const screenWidth = Math.round(window.innerWidth)
      const remainder = screenWidth % 8
      return screenWidth - remainder
    }
    let width = ref(0)
    width.value = getWidth()

    return {
      width,
      // TODO 想法很美好，但实际上用户点击的是iframe里的东西，得想办法把事件传递到父页面
      keymap: {
        enter: throttle(readStore.nextPage, 500),
        right: throttle(readStore.nextPage, 500),
        left: throttle(readStore.prevPage, 500)
      }
    }
  }
})
</script>

<style scoped lang="scss"></style>
