<template>
  <div class="full-size">
    <aspect-ratio class="box" ar="2:3" v-bind="$attrs" @click="openDir">
      <div style="padding: 3px; box-sizing: border-box" class="full-size">
        <div class="full-size" style="background-color: #e9e5e5">
          <div class="full-size" style="box-sizing: border-box; padding: 6px 3px">
            <n-grid x-gap="6" y-gap="8" cols="2">
              <n-gi v-for="book in bookList?.slice(0, 4)" :key="book.id">
                <aspect-ratio ar="2:3" class="image-wrapper">
                  <img :src="book.cover" alt="" />
                </aspect-ratio>
              </n-gi>
            </n-grid>
          </div>
        </div>
      </div>
    </aspect-ratio>
    <div class="text-wrapper">
      <div class="title" :title="groupName"> {{ groupName }} </div>
      <span class="info">共{{ bookList.length }}本</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { useThemeVars } from 'naive-ui'
import { BookData } from '@/types/bookCard'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'BookGroupCard',
  props: {
    bookList: {
      type: Array as PropType<BookData[]>,
      default: () => [
        {
          cover: 'https://img.acgdmzy.com:45112/images/2021/10/05/0d1e85517e85.md.webp',
          title:
            '魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬'
        }
      ]
    },
    groupName: {
      type: String,
      default: () =>
        '魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬魔弹之王与冻涟的雪姬'
    },
    id: String
  },
  setup(props) {
    const router = useRouter()

    return {
      openDir() {
        router.push({ name: 'BookShelf', params: { gid: props.id } })
      }
    }
  }
})
</script>

<style scoped lang="scss">
@import 'src/assets/style/bookCard';

.image-wrapper {
  background-color: white;
  border-radius: var(--border-radius);
}
</style>
