<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-global-style />
    <router-view />
  </n-config-provider>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { zhCN, dateZhCN } from 'naive-ui'
import { icon } from './plugins/naive-ui'
import { useAppStore } from '@/store'

export default defineComponent({
  components: {
    ...icon
  },
  setup() {
    const appStore = useAppStore()

    return {
      zhCN,
      dateZhCN,

      appName: computed(() => appStore.appName),
      changAppName() {
        appStore.asyncReverse()
      }
    }
  }
})
</script>

<style lang="scss" scoped></style>
