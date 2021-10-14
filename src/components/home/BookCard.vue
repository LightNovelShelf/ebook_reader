<template>
  <div class="full-size" :style="property">
    <aspect-ratio class="box" ar="2:3" v-bind="$attrs" @click="openBook">
      <img :src="book.cover" alt="" />
    </aspect-ratio>
    <div class="text-wrapper">
      <div class="title" :title="book.title"> {{ book.title }}</div>
      <span class="info">已读0%</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { BookData } from '@/types/bookCard'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'BookCardGroup',
  props: {
    book: {
      type: Object as PropType<BookData>,
      default: () => ({
        cover: 'https://img.acgdmzy.com:45112/images/2021/10/05/0d1e85517e85.md.webp',
        title:
          '魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬'
      })
    }
  },
  setup(props) {
    const router = useRouter()

    return {
      openBook() {
        console.log('openBook')
        router.push({ name: 'Read', params: { path: props.book.path } })
      },
      property: computed(() => ({
        '--border-size': '0'
      }))
    }
  }
})
</script>

<style scoped lang="scss">
@import 'src/assets/style/bookCard';
</style>
