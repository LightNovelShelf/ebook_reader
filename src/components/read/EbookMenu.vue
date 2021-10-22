<template>
  <n-config-provider :theme-overrides="themeOverrides" abstract>
    <n-layout-content v-if="menuShow" position="absolute" @click="menuShow = false" />
    <transition name="slide-y-transition">
      <n-layout-header key="header" v-show="menuShow" position="absolute" class="header">
        <n-space justify="space-between" align="center">
          <div style="display: flex">
            <n-button text @click="back">
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
          <div style="display: flex" v-for="(item, index) in iconData" :key="index">
            <n-button text @click="item.action">
              <n-icon size="24">{{ item.icon }} </n-icon>
            </n-button>
          </div>
        </n-space>
      </n-layout-footer>
    </transition>

    <slider />
    <font-setting />
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { GlobalThemeOverrides } from 'naive-ui'
import { icon } from '@/plugins/naive-ui'
import { useMenu } from '@/composables/readMenu'
import { useReadStore } from '@/store/read'
import { throttle } from 'lodash-es'
import Slider from '@/components/read/menu/Slider.vue'
import { useRouter } from 'vue-router'
import FontSetting from '@/components/read/menu/FontSetting.vue'

const themeOverrides: GlobalThemeOverrides = {
  Layout: {
    color: '#ffffff00'
  }
}

export default defineComponent({
  name: 'EbookMenu',
  components: { FontSetting, Slider },
  setup() {
    const { menuShow, sliderShow, fontSettingShow, $reset } = useMenu()
    $reset()
    const router = useRouter()
    const bookStore = useReadStore()
    const close = ref<any>(null)

    return {
      iconData: [
        {
          icon: icon.mdiFormatListBulleted,
          action: () => {
            sliderShow.value = true
            menuShow.value = false
          }
        },
        {
          icon: icon.mdiWhiteBalanceSunny,
          action: () => {}
        },
        {
          icon: icon.mdiFormatSize,
          action: () => {
            fontSettingShow.value = true
            menuShow.value = false
          }
        }
      ],
      sliderShow,
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
      prevSection: throttle(bookStore.prevSection, 500),
      back() {
        router.back()
      }
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
