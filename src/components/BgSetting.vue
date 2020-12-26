<template>
    <div class="bg-setting">
        <v-radio-group
            class="mb-3"
            v-model="bgSetting"
            hide-details
            row
            @change="settingChanged"
        >
            <v-radio
                label="无"
                value="none"
            ></v-radio>
            <v-radio
                label="纸质"
                value="paper"
            ></v-radio>
            <v-radio
                label="自定义颜色"
                value="custom"
            ></v-radio>
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
</template>

<script>
import { icon } from '../plugins/vuetify'
import { Storage } from '@/util/storage'
import { mapMutations, mapState } from 'vuex'
const LightNovel_Reading_Bg_Setting = 'LightNovel_Reading_Bg_Setting'
const LightNovel_Reading_Bg_Custom = 'LightNovel_Reading_Bg_Custom'
let defaultColor = { r: 255, g: 255, b: 255, a: 1 }
export default {
    name: 'BgSetting',
    data: () => ({
        icon,
        bgSetting: '',
        color: null
    }),
    computed: {
        ...mapState(['readingBgSetting', 'readingCustomBg']),
        isDark () {
            return this.$vuetify.theme.dark
        }
    },
    methods: {
        ...mapMutations({
            updateReadingCustomBg: 'updateReadingCustomBg',
            updateReadingBgSetting: 'updateReadingBgSetting'
        }),
        settingChanged (value) {
            this.updateReadingBgSetting({
                setting: value
            })
        },
        colorChanged(value) {
            this.updateReadingCustomBg({
                value: value.rgba ? value.rgba : value
            })
        }
    },
    mounted () {
        this.bgSetting = this.readingBgSetting
        if (this.bgSetting === 'custom') {
            if(this.readingCustomBg) {
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
// .uploader-field {
//     position: relative;
//     width: 300px;
//     height: 300px;
//     cursor: pointer;
//     .inner {
//         width: 100%;
//         height: 100%;
//         font-size: 24px;
//     }
// }
</style>