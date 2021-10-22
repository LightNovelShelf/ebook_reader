<template>
  <div class="full-size" :style="property" v-intersect="onIntersectChange">
    <aspect-ratio class="box" ar="2:3" v-bind="$attrs" @click="openBook">
      <img v-if="book.cover" :src="book.cover" alt="" />
      <img class="loading" v-else :src="loadingIcon" alt="" />
    </aspect-ratio>
    <div class="text-wrapper">
      <div class="title" :title="title"> {{ title }}</div>
      <span class="info">已读0%</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { BookData } from '@/types/bookCard'
import { useRouter } from 'vue-router'
import { getEpubInfo } from '@/service'
import { useBookshelfStore } from '@/store/bookshelf'
import loadingIcon from '@/assets/img/loading.svg'

const path = require('path')

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
    const bookshelfStore = useBookshelfStore()

    return {
      loadingIcon,
      openBook() {
        router.push({ name: 'Read', params: { path: props.book.path } })
        // TODO 将书移动到首位，有点问题，这样搞必须进行两次操作才能成功把书移过去
        // let book = props.book
        // bookshelfStore.moveFunction = () => {
        //   bookshelfStore.moveToFirst(book)
        //   bookshelfStore.moveFunction = undefined
        // }
        // bookshelfStore.moveToFirst(props.book)
      },
      title: computed(() => props.book.title || path.basename(props.book.path, '.epub')),
      property: computed(() => ({
        '--border-size': '0'
      })),
      async onIntersectChange(entries, observer, isIntersecting) {
        if (entries) {
          if (!props.book.title) {
            let book = bookshelfStore.getBookByPath(props.book.path)
            const info = await getEpubInfo(props.book.path)
            book.title = info.title
            book.cover = info.cover
            book.id = info.id
            bookshelfStore.saveData()
          }
        }
      }
    }
  }
})
</script>

<style scoped lang="scss">
@import 'src/assets/style/bookCard';

:deep(.aspect-ratio__content) {
  display: flex;
  justify-content: center;
  align-items: center;

  .loading {
    width: auto;
    height: 15%;
  }
}
</style>
