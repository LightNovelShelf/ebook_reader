<template>
  <ebook-reader class="read" :uri="uri" :name="name"></ebook-reader>
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

<style scoped lang="scss">
  .read {
    background: var(--bg-img);
  }
</style>
