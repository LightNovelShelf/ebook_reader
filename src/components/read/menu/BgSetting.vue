<template>
  <v-dialog v-model="bgSettingShow" max-width="500px">
    <v-card>
      <v-card-subtitle class="pt-5 pb-0">阅读背景选项</v-card-subtitle>
      <v-card-text class="">
        <div class="bg-setting">
          <v-radio-group class="mb-3" v-model="bgSetting" hide-details row @change="settingChanged">
            <v-radio label="无" value="none"></v-radio>
            <v-radio label="纸质" value="paper"></v-radio>
            <v-radio label="自定义颜色" value="custom"></v-radio>
          </v-radio-group>
          <div class="color-picker" v-if="bgSetting === 'custom'">
            <v-color-picker
              v-model="color"
              dot-size="18"
              hide-mode-switch
              hide-inputs
              mode="rgba"
              swatches-max-height="200"
              @update:color="colorChanged"
            ></v-color-picker>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { icon } from '@/plugins/vuetify'
  import { mapMutations, mapGetters } from 'vuex'

  let defaultColor = { r: 255, g: 255, b: 255, a: 1 }
  export default {
    name: 'BgSetting',
    data: () => ({
      icon,
      bgSetting: '',
      color: null
    }),
    computed: {
      ...mapGetters(['readingBgSetting', 'readingCustomBg', 'book']),
      isDark() {
        return this.$vuetify.theme.dark
      },
      bgSettingShow: {
        get() {
          return this.$store.state.read.bgSettingShow
        },
        set(val) {
          this.updateBgSettingShow(val)
        }
      }
    },
    methods: {
      ...mapMutations(['updateReadingCustomBg', 'updateReadingBgSetting', 'updateBgSettingShow']),
      settingChanged(value) {
        this.updateReadingBgSetting({
          setting: value
        })
      },
      colorChanged(value) {
        this.updateReadingCustomBg({
          value: value.rgba ? value.rgba : value
        })
      },
      computeFontColor(r, g, b) {
        let contrast = (r * 299 + g * 587 + b * 114) / 1000
        if (contrast >= 125) {
          return 'dark'
        }
        return 'light'
      }
    },
    mounted() {
      this.bgSetting = this.readingBgSetting
      if (this.bgSetting === 'custom') {
        if (this.readingCustomBg) {
          defaultColor = this.readingCustomBg
        }
        this.color = defaultColor
      }
    }
  }
</script>

<style lang="scss" scoped>
  .custom-bg-file-input {
    display: none;
  }
</style>
