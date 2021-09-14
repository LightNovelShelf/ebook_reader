<template>
  <teleport to="body">
    <n-config-provider :theme-overrides="themeOverrides" v-if="menuShow">
      <n-layout position="absolute" class="menu">
        <n-layout-content position="absolute" @click="menuShow = false">平山道</n-layout-content>
        <n-layout-header position="absolute" class="header">
          <n-space justify="space-between" align="center">
            <div style="display: flex">
              <n-button text>
                <n-icon size="24">{{ icon.mdiArrowLeft }} </n-icon>
              </n-button>
            </div>
            <div style="display: flex">
              <n-button text>
                <n-icon size="24">{{ icon.mdiMagnify }} </n-icon>
              </n-button>
            </div>
          </n-space>
        </n-layout-header>
        <n-layout-footer position="absolute" class="footer">
          <n-space justify="space-around">
            <div style="display: flex">
              <n-button text>
                <n-icon size="24">{{ icon.mdiMenu }} </n-icon>
              </n-button>
            </div>
            <div>字体</div>
            <div>设置</div>
          </n-space>
        </n-layout-footer>
      </n-layout>
    </n-config-provider>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { GlobalThemeOverrides } from 'naive-ui'
import { icon } from '@/plugins/naive-ui'
import { useMenu } from '@/composables/readMenu'

const themeOverrides: GlobalThemeOverrides = {
  Layout: {
    color: '#ffffff00'
  }
}

export default defineComponent({
  name: 'EbookMenu',
  setup() {
    const { menuShow } = useMenu()

    return {
      icon,
      themeOverrides,
      menuShow
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  padding: 10px 25px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}
.footer {
  padding: 10px;
  box-shadow: 0 -5px 5px rgba(0, 0, 0, 0.2);
}
</style>
