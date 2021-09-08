<template>
  <ebook-reader :name="name"></ebook-reader>
</template>

<script>
import { defineComponent } from 'vue'
import EbookReader from '@/components/read/EbookReader.vue'

export default defineComponent({
  name: 'Read',
  components: { EbookReader },
  props: {
    name: String
  },
  setup() {
    return {}
  }
})
</script>

<style lang="scss"></style>
