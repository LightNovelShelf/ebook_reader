<template>
  <teleport to="body">
    <n-config-provider :theme-overrides="themeOverrides" abstract>
      <n-layout-content v-show="menuShow" position="absolute" @click="menuShow = false" />
      <transition name="slide-y-transition">
        <n-layout-header key="header" v-show="menuShow" position="absolute" class="header">
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
      </transition>

      <transition name="slide-y-reverse-transition">
        <n-layout-footer v-show="menuShow" position="absolute" class="footer">
          <n-space justify="space-around">
            <div style="display: flex">
              <n-button text>
                <n-icon size="24">{{ icon.mdiFormatListBulleted }} </n-icon>
              </n-button>
            </div>
            <div style="display: flex">
              <n-button text>
                <n-icon size="24">{{ icon.mdiWhiteBalanceSunny }} </n-icon>
              </n-button>
            </div>
            <div style="display: flex">
              <n-button text>
                <n-icon size="24">{{ icon.mdiFormatSize }} </n-icon>
              </n-button>
            </div>
          </n-space>
        </n-layout-footer>
      </transition>
    </n-config-provider>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
  padding: 15px 10px;
  box-shadow: 0 -5px 5px rgba(0, 0, 0, 0.2);
}
</style>
