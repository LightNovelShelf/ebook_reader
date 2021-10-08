<template>
  <div class="wrapper">
    <div class="header" ref="header" v-mutate="onMutate">
      <n-space justify="space-between" align="center">
        <div>阅读时长 <span style="font-size: 1.5em">114514</span> 小时</div>
        <div>
          <n-space>
            <n-button text>
              <n-icon size="24">{{ icon.mdiMagnify }}</n-icon>
            </n-button>
            <n-popover placement="bottom-end" trigger="click" style="padding: 0">
              <template #trigger>
                <n-button text>
                  <n-icon size="24">{{ icon.mdiDotsVertical }}</n-icon>
                </n-button>
              </template>
              <n-button-group vertical size="large">
                <n-button> 打开书籍 </n-button>
                <n-button> 打开文件夹 </n-button>
              </n-button-group>
            </n-popover>
          </n-space>
        </div>
      </n-space>
    </div>

    <div class="content">
      <n-grid x-gap="12" y-gap="8" :cols="3">
        <n-gi>
          <book-card-group></book-card-group>
        </n-gi>
        <n-gi>
          <book-card-group></book-card-group>
        </n-gi>
        <n-gi>
          <book-card-group></book-card-group>
        </n-gi>
        <n-gi>
          <book-card-group></book-card-group>
        </n-gi>
        <n-gi>
          <book-card></book-card>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { NLayoutContent, NButtonGroup, NButton, NPopover, NSpace, useThemeVars, NGrid, NGi, NCard } from 'naive-ui'
import { icon } from '@/plugins/naive-ui'
import { BookCardGroup, BookCard } from '@/components/home/index'

export default defineComponent({
  name: 'BookShelf',
  components: {
    NSpace,
    NButtonGroup,
    NButton,
    NPopover,
    NGrid,
    NGi,
    BookCardGroup,
    BookCard
  },
  setup() {
    const theme = useThemeVars()

    return {
      icon,
      theme,
      onMutate(a) {
        // console.log(a)
      },
      boxStyle: computed(() => {
        return {
          border: `1px solid ${theme.value.borderColor}`,
          borderRadius: `${theme.value.borderRadius}`,
          borderColor: `${theme.value.borderColor}`,
          boxShadow: '0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)'
        }
      })
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
  }

  .content {
    padding: var(--padding-x);
    padding-top: 62px;
  }

  .light-green {
    background-color: rgba(0, 128, 0, 0.12);
  }
  .green {
    background-color: rgba(0, 128, 0, 0.24);
  }
}
</style>
