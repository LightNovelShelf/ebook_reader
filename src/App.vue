<template>
  <n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN">
    <n-global-style />
    <router-view />
  </n-config-provider>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { zhCN, dateZhCN } from 'naive-ui'
import { icon } from './plugins/naive-ui'
import { useOsTheme, darkTheme } from 'naive-ui'

export default defineComponent({
  components: {
    ...icon
  },
  setup() {
    const osThemeRef = useOsTheme()

    return {
      zhCN,
      dateZhCN,

      theme: computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))
    }
  }
})
</script>

<style lang="scss" scoped></style>
