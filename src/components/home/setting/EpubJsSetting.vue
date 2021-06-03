<template>
  <v-card class="pa-6">
    <v-card-title class="pa-0 mb-3">修改epub.js版本</v-card-title>
    <v-select hide-details :items="items" label="选择" outlined v-model="selected" class='pb-2'></v-select>
    <v-card-text class='pa-0'>前半部分表示epub.js的版本，后半部分表示修改的部分<br/>修改部分中，chinese表示中文定位修复版本</v-card-text>
    <v-card-text class='pa-0'><code>85</code>是稳定版，bug少，但竖排文本支持差</v-card-text>
    <v-card-text class='pa-0'><code>last</code>是最新版，bug多，但竖排文本支持度高，同时有新特性(bug)</v-card-text>
  </v-card>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'

  export default {
    name: 'EpubJsSetting',
    data: () => ({
      items: ['85.chinese', 'last.chinese']
    }),
    computed: {
      ...mapState('setting', ['epubJsVersion']),
      selected: {
        get() {
          return this.epubJsVersion
        },
        set(val) {
          this.updateEpubJsVersion(val)
        }
      }
    },
    methods: {
      ...mapMutations('setting', ['updateEpubJsVersion'])
    }
  }
</script>

<style scoped>

</style>
