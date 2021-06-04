<template>
  <v-card class="pa-6">
    <v-card-title class="pa-0 mb-3">修改epub.js版本</v-card-title>
    <v-select
      hide-details
      :items="versionItems"
      label="选择"
      outlined
      v-model="versionSelected"
      class="pb-2"
    ></v-select>
    <v-card-text class="pa-0"
      >前半部分表示epub.js的版本，后半部分表示修改的部分<br />修改部分中，chinese表示中文定位修复版本</v-card-text
    >
    <v-card-text class="pa-0"><code>85</code>是稳定版，bug少，但EPUB和RTL支持度差</v-card-text>
    <v-card-text class="pa-0"><code>last</code>是最新版，但EPUB和RTL支持度高，同时有新特性(bug)</v-card-text>

    <v-card-title class="pl-0 pb-0 mb-3">预加载设置</v-card-title>
    <v-select
      hide-details
      :items="managerItems"
      label="选择"
      outlined
      v-model="managerSelected"
      class="pb-2"
    ></v-select>
    <v-card-text class="pa-0"><code>continuous</code>表示开启章节预加载</v-card-text>

    <v-card-title class="pl-0 pb-0 mb-3">滑动设置</v-card-title>
    <v-select hide-details :items="flowItems" label="选择" outlined v-model="flowSelected" class="pb-2"></v-select>
    <v-card-text class="pa-0"><code>paginated</code>表示开启页面滑动，如果开启滑动，为了更好的体验，请开启章节预加载</v-card-text>

    <v-card-text class="pa-0 pt-2 red--text">作者建议：不要开启页面滑动<br/>如果开启预加载请使用85版本，否则使用last版本</v-card-text>
  </v-card>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'

  export default {
    name: 'EpubJsSetting',
    data: () => ({
      versionItems: ['85.chinese', 'last.chinese'],
      managerItems: ['default', 'continuous'],
      flowItems: ['default', 'paginated']
    }),
    computed: {
      ...mapState('setting', ['epubJsVersion', 'epubJsManager', 'epubJsFlow']),
      versionSelected: {
        get() {
          return this.epubJsVersion
        },
        set(val) {
          this.updateEpubJsVersion(val)
        }
      },
      managerSelected: {
        get() {
          return this.epubJsManager
        },
        set(val) {
          this.updateEpubJsManager(val)
        }
      },
      flowSelected: {
        get() {
          return this.epubJsFlow
        },
        set(val) {
          this.updateEpubJsFlow(val)
        }
      }
    },
    methods: {
      ...mapMutations('setting', ['updateEpubJsVersion', 'updateEpubJsFlow', 'updateEpubJsManager'])
    }
  }
</script>

<style scoped></style>
