<template>
  <div class="wrapper">
    <div class="header" :style="headerStyle" ref="header" v-mutate="onMutate">
      <n-space justify="space-between" align="center">
        <div>共计阅读xxxx小时</div>
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

    <n-layout-content :style="contentStyle" content-style="padding: var(--padding-x);">
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
      <n-h2>意义不明的内容</n-h2>
    </n-layout-content>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { NH2, NLayoutContent, NButtonGroup, NButton, NPopover, NSpace, useThemeVars } from 'naive-ui'
import { icon } from '@/plugins/naive-ui'

export default defineComponent({
  name: 'BookShelf',
  components: {
    NH2,
    NLayoutContent,
    NSpace,
    NButtonGroup,
    NButton,
    NPopover
  },
  setup() {
    const theme = useThemeVars()
    const header = ref()
    let headerHeight = ref('62px')

    return {
      icon,
      onMutate(a) {
        console.log(a)
      },
      headerStyle: computed(() => {
        return {
          borderBottom: `solid 1px ${theme.value.borderColor}`
        }
      }),
      contentStyle: computed(() => {
        return {
          paddingTop: headerHeight.value
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.wrapper {
  // --header-height: 64px;
  --padding-x: 15px;

  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    // height: var(--header-height);
    padding: 15px var(--padding-x);
    z-index: 1;
    background-color: white;
  }

  .content {
    top: var(--header-height);
  }
}
</style>
