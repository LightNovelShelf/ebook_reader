<template>
  <div class="wrapper" :style="property">
    <div class="header" ref="header">
      <n-space justify="space-between" align="center">
        <div>阅读时长 <span style="font-size: 1.5em">114514</span> 小时</div>
        <div>
          <n-space>
            <n-button text>
              <n-icon size="24" class="icon">{{ icon.mdiMagnify }}</n-icon>
            </n-button>
            <n-popover placement="bottom-end" trigger="click" style="padding: 0">
              <template #trigger>
                <n-button text>
                  <n-icon size="24" class="icon">{{ icon.mdiDotsVertical }}</n-icon>
                </n-button>
              </template>
              <n-button-group vertical size="large">
                <n-button @click="chooseBook"> 打开书籍 </n-button>
                <n-button @click="chooseDir"> 打开文件夹 </n-button>
              </n-button-group>
            </n-popover>
          </n-space>
        </div>
      </n-space>
    </div>

    <div class="content">
      <n-grid x-gap="12" y-gap="8" :cols="3">
        <template v-if="gid">
          <n-gi v-for="book in bookList?.data" :key="book.id">
            <book-card :book="book" />
          </n-gi>
        </template>
        <template v-else>
          <n-gi v-for="book in bookList" :key="book.id">
            <book-group-card
              :book-list="book.data"
              :id="book.id"
              :group-name="book.groupName"
              v-if="book.type === 'BookGroupCard'"
            />
            <book-card :book="book.data" v-else />
          </n-gi>
        </template>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { storeToRefs } from 'pinia'
import { NButtonGroup, NButton, NPopover, NSpace, useThemeVars, NGrid, NGi } from 'naive-ui'
import { icon } from '@/plugins/naive-ui'
import { BookGroupCard, BookCard } from '@/components/home/index'
import { useBookshelfStore } from '@/store/bookshelf'
import { useRouter } from 'vue-router'
import { getEpubInfo } from '@/service'

export default defineComponent({
  name: 'BookShelf',
  props: {
    gid: String
  },
  components: {
    NSpace,
    NButtonGroup,
    NButton,
    NPopover,
    NGrid,
    NGi,
    BookGroupCard,
    BookCard
  },
  setup(props) {
    const theme = useThemeVars()
    const router = useRouter()
    const bookshelfStore = useBookshelfStore()
    const getBookList = bookshelfStore.getBookList
    bookshelfStore.init()
    const chooseFile = inject('chooseFile') as any

    return {
      bookList: computed(() => getBookList(props.gid)),
      icon,
      property: computed(() => ({
        '--border-size': '1px',
        '--border-color': theme.value.borderColor,
        '--border-radius': theme.value.borderRadius,
        '--opacity-2': theme.value.opacity2
      })),
      async chooseBook() {
        console.log('chooseBook')
        let file = await chooseFile.chooseFile('epub')
        await router.push({ name: 'Read', params: { path: file } })
        let bookInfo = await getEpubInfo(file)
        if (!bookshelfStore.hasBook(file)) {
          bookshelfStore.addBook(bookInfo.id, { title: bookInfo.title, cover: bookInfo.cover, path: file })
        }
      },
      async chooseDir() {
        console.log('chooseDir')
        let file = await chooseFile.chooseDir()
        console.log(file)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  --padding-x: 12px;

  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 15px var(--padding-x);
    z-index: 1;
    background-color: white;

    .icon {
      opacity: var(--opacity-2);
    }
  }

  .content {
    padding: var(--padding-x);
    padding-top: 64px;
  }

  .light-green {
    background-color: rgba(0, 128, 0, 0.12);
  }
  .green {
    background-color: rgba(0, 128, 0, 0.24);
  }
}
</style>
