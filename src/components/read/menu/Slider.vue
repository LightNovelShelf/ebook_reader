<template>
  <transition name="slide-x-transition">
    <div class="drawer" v-show="sliderShow">
      <div class="drawer-mask" @click="sliderShow = false"></div>
      <div class="drawer-content" :style="{ backgroundColor: themeVar.baseColor }">
        <n-list style="margin: 0">
          <n-list-item v-for="item in toc" :key="item.id" class="list-item" @click="changeSection(item.href)">
            <div>{{ `${new Array(item.level + 1).join('&emsp;')}${item.label}` }}</div>
          </n-list-item>
        </n-list>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMenu } from '@/composables/readMenu'
import { useThemeVars } from 'naive-ui'
import { useReadStore } from '@/store/read'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'Slider',
  setup() {
    const { sliderShow } = useMenu()
    const themeVar = useThemeVars()
    const readStore = useReadStore()
    const { toc } = storeToRefs(readStore)

    return {
      toc,
      sliderShow,
      themeVar,
      changeSection(location) {
        sliderShow.value = false
        readStore.display(location)
      }
    }
  }
})
</script>

<style scoped lang="scss">
.drawer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  //pointer-events: none;

  .drawer-content {
    position: absolute;
    overflow: auto;
    left: 0;
    top: 0;
    height: 100%;
    max-width: 50vw;
    min-width: 200px;
    box-shadow: 8px 0 8px rgb(0 0 0 / 15%);

    .list-item {
      padding-left: 15px;
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
        transition: background-color 0.2s linear;
      }
    }
  }

  .drawer-mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
</style>
