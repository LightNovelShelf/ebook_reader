<template>
  <ebook-reader :path="path"></ebook-reader>
</template>

<script>
  import EbookReader from '@/components/ebook/EbookReader'
  export default {
    name: 'index',
    components: { EbookReader },
    props: {
      path: String
    },
  }
</script>

<style scoped></style>
