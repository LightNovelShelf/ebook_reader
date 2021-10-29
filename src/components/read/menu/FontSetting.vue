<template>
  <n-modal
    class="custom-card"
    v-model:show="fontSettingShow"
    preset="card"
    :style="bodyStyle"
    title="字体设置"
    size="huge"
    :bordered="false"
  >
    <n-slider v-model:value="fontSize" :min="12" :max="24" />
  </n-modal>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'
import { useMenu } from '@/composables/readMenu'
import { useReadStore } from '@/store/read'

export default defineComponent({
  name: 'FontSetting',
  setup() {
    const { fontSettingShow } = useMenu()
    const readStore = useReadStore()
    const fontSize = toRef(readStore.setting, 'fontSize')

    return {
      fontSettingShow,
      bodyStyle: {
        maxWidth: '90%'
      },
      fontSize
    }
  }
})
</script>

<style scoped lang="scss"></style>
