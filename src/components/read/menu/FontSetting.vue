<template>
  <n-modal
    class="custom-card"
    v-model:show="fontSettingShow"
    preset="card"
    :style="bodyStyle"
    title="卡片预设"
    size="huge"
    :bordered="false"
    :segmented="segmented"
  >
    <template #header-extra> 噢! </template>
    内容
    <template #footer> 尾部 </template>
  </n-modal>
</template>

<script>
import { defineComponent } from 'vue'
import { useMenu } from '@/composables/readMenu'

export default defineComponent({
  name: 'FontSetting',
  setup() {
    const { fontSettingShow } = useMenu()
    return {
      fontSettingShow,
      bodyStyle: {
        maxWidth: '90%'
      },
      segmented: {
        content: 'soft',
        footer: 'soft'
      }
    }
  }
})
</script>

<style scoped lang="scss"></style>
