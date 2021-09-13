<template>
  <ebook-reader :name="name"></ebook-reader>
  <teleport to="body">
    <n-config-provider :theme-overrides="themeOverrides" v-if="menuShow">
      <n-layout position="absolute" class="menu">
        <n-layout-content position="absolute" @click="menuShow = false">平山道</n-layout-content>
        <n-layout-header position="absolute" class="header">
          <n-space justify="space-between">
            <div>Back</div>
            <div>Search</div>
          </n-space>
        </n-layout-header>
        <n-layout-footer position="absolute" class="footer">
          <n-space justify="space-around">
            <div>章节</div>
            <div>字体</div>
            <div>设置</div>
          </n-space>
        </n-layout-footer>
      </n-layout>
    </n-config-provider>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EbookReader from '@/components/read/EbookReader.vue'
import { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  Layout: {
    color: '#ffffff00'
  }
}

export default defineComponent({
  name: 'Read',
  components: { EbookReader },
  props: {
    name: String
  },
  setup() {
    return {
      themeOverrides,
      menuShow: ref(true)
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  padding: 10px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.2);
}
.footer {
  padding: 10px;
  box-shadow: 0 -5px 5px rgba(0, 0, 0, 0.2);
}
</style>
