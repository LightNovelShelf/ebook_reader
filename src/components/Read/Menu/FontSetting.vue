<template>
  <v-dialog v-model="fontSettingShow" max-width="500px">
    <v-card>
      <v-card-subtitle class="pt-5">修改字体大小</v-card-subtitle>
      <v-card-text class="pb-0 pt-4">
        <v-slider
          dense
          v-model="fontSize"
          thumb-label="always"
          max="30"
          min="12"
          :prepend-icon="icon.mdiFormatSize"
        ></v-slider>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex'
  import { icon } from '@/plugins/vuetify'

  export default {
    name: 'FontSetting',
    data() {
      return {
        icon: icon
      }
    },
    computed: {
      fontSize: {
        get() {
          return this.$store.state.read.fontSize
        },
        set(val) {
          this.updateFontSize(val)
        }
      },
      fontSettingShow: {
        get() {
          return this.$store.state.read.fontSettingShow
        },
        set(val) {
          this.updateFontSettingShow(val)
        }
      }
    },
    methods: {
      ...mapMutations(['updateFontSettingShow', 'updateFontSize'])
    }
  }
</script>

<style scoped></style>
