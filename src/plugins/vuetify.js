import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import { mdiMagnify, mdiFormatSize,mdiFormatListBulleted ,mdiWhiteBalanceSunny} from '@mdi/js'

Vue.use(Vuetify)

export default new Vuetify({})

export const icon = {
  mdiMagnify,
  mdiFormatSize,
  mdiFormatListBulleted,
  mdiWhiteBalanceSunny
}
