<template>
  <ebook-reader :name="name"></ebook-reader>
  <ebook-menu></ebook-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EbookReader from '@/components/read/EbookReader.vue'
import EbookMenu from '@/components/read/EbookMenu.vue'

export default defineComponent({
  name: 'Read',
  components: { EbookMenu, EbookReader },
  props: {
    name: String
  },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped></style>
