<template>
  <div>
    <!--    <div id="read" :style="{ width: width + 'px' }"></div>-->
    <div>read</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useReadStore } from '@/store/read'

export default defineComponent({
  name: 'EbookReader',
  props: {
    name: String
  },
  setup() {
    const readStore = useReadStore()
    readStore.loadEpub('/Test1.epub').then((book) => {
      console.log(book)
    })

    return {}
  }
})
</script>

<style scoped lang="scss"></style>
