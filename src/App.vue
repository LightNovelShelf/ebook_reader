<template>
  <n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN" :theme-overrides="themeOverrides">
    <n-global-style />
    <router-view />
  </n-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { zhCN, dateZhCN, GlobalThemeOverrides, useOsTheme, darkTheme } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2080f0',
    primaryColorHover: '#4098fc',
    primaryColorPressed: '#1060c9',
    primaryColorSuppl: '#4098fc',
    borderRadius: '4px'
  }
}

export default defineComponent({
  setup() {
    const osThemeRef = useOsTheme()

    return {
      zhCN,
      dateZhCN,

      theme: computed(() => (osThemeRef.value === 'dark' ? darkTheme : null)),
      themeOverrides
    }
  }
})
</script>

<style lang="scss" scoped></style>
