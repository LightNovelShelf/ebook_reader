<template>
  <n-config-provider :theme-overrides="themeOverrides" abstract>
    <n-layout-content v-if="menuShow" position="absolute" @click="menuShow = false" />
    <transition name="slide-y-transition">
      <n-layout-header key="header" v-show="menuShow" position="absolute" class="header">
        <n-space justify="space-between" align="center" v-intersect="onIntersectClose">
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
        <n-space justify="space-between" align="center">
          <div style="display: flex">
            <n-button @click="prevSection()"> 上一章 </n-button>
          </div>
          <div style="display: flex">
            <n-text
              style="max-width: calc(100vw - 250px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
              >{{ title }}
            </n-text>
            <n-text>{{ progress }}</n-text>
          </div>
          <div style="display: flex">
            <n-button @click="nextSection()"> 下一章 </n-button>
          </div>
        </n-space>
        <n-space justify="space-around" style="padding-top: 20px">
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
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { GlobalThemeOverrides } from 'naive-ui'
import { icon } from '@/plugins/naive-ui'
import { useMenu } from '@/composables/readMenu'
import { useReadStore } from '@/store/read'
import { functions, throttle } from 'lodash-es'
import useIntersectClose from '@/composables/intersectClose'

const themeOverrides: GlobalThemeOverrides = {
  Layout: {
    color: '#ffffff00'
  }
}

export default defineComponent({
  name: 'EbookMenu',
  setup() {
    const { menuShow } = useMenu()
    const bookStore = useReadStore()
    const close = ref<any>(null)
    const { onIntersectClose, onClose } = useIntersectClose()
    onClose(() => (menuShow.value = false))

    return {
      onIntersectClose,
      close,
      icon,
      themeOverrides,
      menuShow,
      bookStore,
      progress: computed(() => {
        if (bookStore.toc && bookStore.section && bookStore.section.index < bookStore.toc.length) {
          return `(${bookStore.section.pageIndex}/${bookStore.section.pageTotal})`
        }
        return ''
      }),
      title: computed(() => {
        if (bookStore.toc && bookStore.section && bookStore.section.index < bookStore.toc.length) {
          let section = bookStore.toc[bookStore.section.index]
          return section?.label
        }
        return ''
      }),

      nextSection: throttle(bookStore.nextSection, 500),
      prevSection: throttle(bookStore.prevSection, 500)
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
