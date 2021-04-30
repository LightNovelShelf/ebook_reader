<template>
  <ebook-reader class="read" :name="name"></ebook-reader>
</template>

<script>
  import EbookReader from '@/components/Read/EbookReader'
  import { saveReadTime, getReadTime } from '@/util/read'

  export default {
    name: 'Read',
    components: { EbookReader },
    props: {
      name: String
    },
    methods: {
      startLoopReadTime() {
        let readTime = getReadTime()
        if (!readTime) {
          readTime = 0
        }
        this.task = setInterval(() => {
          if (!document.hidden) {
            readTime++
            saveReadTime(readTime)
          }
        }, 60000)
      }
    },
    mounted() {
      this.startLoopReadTime()
    },
    beforeDestroy() {
      if (this.task) {
        clearInterval(this.task)
      }
    }
  }
</script>

<style scoped lang="scss">
  .read {
    background: var(--bg-img);
  }
</style>
