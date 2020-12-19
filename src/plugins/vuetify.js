import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import { mdiMagnify, mdiFormatSize, mdiFormatListBulleted, mdiWhiteBalanceSunny, mdiArrowLeft } from '@mdi/js'

Vue.use(Vuetify)

export default new Vuetify({})

export const icon = {
  mdiArrowLeft,
  mdiMagnify,
  mdiFormatSize,
  mdiFormatListBulleted,
  mdiWhiteBalanceSunny
}
