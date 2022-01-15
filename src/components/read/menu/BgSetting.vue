<template>
  <n-modal
    size="medium"
    preset="card"
    title="阅读背景选项"
    v-model:show="bgSettingShow"
    :style="{ width: 'fit-content' }"
    :bordered="false"
  >
    <div class="bg-setting">
      <n-radio-group v-model:value="bgType">
        <n-space>
          <n-radio value="none">无</n-radio>
          <n-radio value="paper">纸质</n-radio>
          <n-radio value="custom">自定义颜色</n-radio>
        </n-space>
      </n-radio-group>
      <div class="color-picker">
        <n-color-picker
          v-show="false"
          show-preview
          :to="picker"
          :show="true"
          :modes="['rgb']"
          :theme-overrides="{ boxShadow: 'none' }"
          v-model:value="background"
        />
        <div ref="picker" v-show="bgType === 'custom'"></div>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useMenu } from '@/composables/readMenu'
import { useReadStore } from '@/store/read'

export default defineComponent({
  name: 'BgSetting',
  setup() {
    const picker = ref(null)
    const { bgSettingShow } = useMenu()
    const readStore = useReadStore()
    const bgType = computed({
      get: () => readStore.setting.backgroundType,
      set: (setting: string) => readStore.setBackgroundType(setting)
    })
    const background = computed({
      get: () => readStore.setting.background,
      set: (color: string) => readStore.setBackground(color)
    })

    return {
      bgSettingShow,
      bgType,
      background,
      picker
    }
  }
})
</script>

<style lang="scss">
.bg-setting {
  .v-binder-follower-container,
  .v-binder-follower-content {
    position: static;
    height: auto;
    transform: none !important;
  }
  .n-color-picker-pallete {
    height: 120px;
  }
  .n-color-picker-control {
    padding: 10px 0;
  }
}
</style>
