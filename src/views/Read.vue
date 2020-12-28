<template>
  <ebook-reader :uri="uri" :name="name"></ebook-reader>
</template>

<script>
  import EbookReader from '@/components/Read/EbookReader'
  export default {
    name: 'Read',
    components: { EbookReader },
    props: {
      uri: String,
      name: String
    }
  }
</script>

<style scoped></style>
