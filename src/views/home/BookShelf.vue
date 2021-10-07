<template>
  <div class="wrapper">
    <div class="header" ref="header" v-mutate="onMutate">
      <n-space justify="space-between" align="center">
        <div>共计阅读114514小时</div>
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

    <n-layout-content class="content" content-style="padding:var(--padding-x);">
      <n-grid x-gap="12" y-gap="8" :cols="3">
        <n-gi>
          <n-card content-style="padding:0;padding-bottom:150%">
            <template #cover>
              <img
                style="position: absolute; top: 0; left: 0; bottom: 0; right: 0"
                src="https://img.acgdmzy.com:45112/images/2021/10/05/0d1e85517e85.webp"
                alt=""
              />
            </template>
          </n-card>
          <div>魔弹之王与冻涟的雪姬</div>
        </n-gi>
        <n-gi>
          <div class="green"></div>
        </n-gi>
        <n-gi>
          <div class="light-green"></div>
        </n-gi>
        <n-gi>
          <div class="green"></div>
        </n-gi>
      </n-grid>
    </n-layout-content>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { NLayoutContent, NButtonGroup, NButton, NPopover, NSpace, useThemeVars, NGrid, NGi, NCard } from 'naive-ui'
import { icon } from '@/plugins/naive-ui'

export default defineComponent({
  name: 'BookShelf',
  components: {
    NLayoutContent,
    NSpace,
    NButtonGroup,
    NButton,
    NPopover,
    NGrid,
    NGi,
    NCard
  },
  setup() {
    const theme = useThemeVars()

    return {
      icon,
      onMutate(a) {
        // console.log(a)
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
  }

  .content {
    top: var(--header-height);
    padding-top: 62px;
  }

  .light-green {
    height: 108px;
    background-color: rgba(0, 128, 0, 0.12);
  }
  .green {
    height: 108px;
    background-color: rgba(0, 128, 0, 0.24);
  }
}
</style>
