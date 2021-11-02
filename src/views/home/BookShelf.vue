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
                <n-button @click="chooseBook"> 打开书籍</n-button>
                <n-button @click="chooseDir"> 打开文件夹</n-button>
              </n-button-group>
            </n-popover>
          </n-space>
        </div>
      </n-space>
    </div>

    <div class="content">
      <div class="grid">
        <!-- <n-grid x-gap="12" y-gap="8" :cols="3"> -->
        <transition-group>
          <template v-if="gid">
            <div class="grid-item" v-for="book in bookList?.data" :key="book.id">
              <book-card :book="book" />
            </div>
          </template>
          <template v-else>
            <div class="grid-item" v-for="book in bookList" :key="book.id">
              <book-group-card
                :book-list="book.data"
                :id="book.id"
                :group-name="book.groupName"
                v-if="book.type === 'BookGroupCard'"
              />
              <book-card :book="book.data" v-else />
            </div>
          </template>
        </transition-group>
        <!-- </n-grid> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue'
import { NButtonGroup, NButton, NPopover, NSpace, useThemeVars } from 'naive-ui'
import { icon } from '@/plugins/naive-ui'
import { BookGroupCard, BookCard } from '@/components/home/index'
import { useBookshelfStore } from '@/store/bookshelf'
import { useRouter } from 'vue-router'
import { getEpubInfo, getDirectories, getFiles } from '@/service'
import { Guid } from 'js-guid'

const path = require('path')

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
    // NGrid,
    // NGi,
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
        console.log(file)
        await router.push({ name: 'Read', params: { path: file } })
        let bookInfo = await getEpubInfo(file)
        if (!bookshelfStore.getBookByPath(file)) {
          bookshelfStore.addBook(bookInfo.id, { title: bookInfo.title, cover: bookInfo.cover, path: file })
        }
      },
      async chooseDir() {
        console.log('chooseDir')
        let choosePath = await chooseFile.chooseDir()
        let run = async (_path) => {
          const book: string[] = []
          let files = await getFiles(_path)
          let dirs = await getDirectories(_path)
          files
            .filter((x) => x.endsWith('epub'))
            .map((x) => {
              if (!bookshelfStore.getBookByPath(x)) book.push(x)
            })
          if (book.length !== 0) {
            bookshelfStore.addBookGroup(
              path.basename(_path),
              book.map((x) => ({ path: x, id: Guid.newGuid().toString() }))
            )
          }
          dirs.forEach((dir) => {
            run(dir)
          })
        }
        await run(choosePath)
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

  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0px, 1fr));
    gap: 8px 12px;
  }

  .grid-item {
    grid-column: span 1 / span 1;
  }

  .content {
    padding: var(--padding-x);
    padding-top: 64px;

    .flip-list-move {
      transition: all 0.5s;
    }

    .flip-list-enter-active,
    .flip-list-leave-active {
      transition: all 0.5s;
    }

    .flip-list-leave-active {
      position: absolute;
    }

    .flip-list-enter,
    .flip-list-leave-to {
      opacity: 0;
      transform: scale(0);
      max-width: 0;
      flex-basis: 0;
    }
  }
}
</style>
