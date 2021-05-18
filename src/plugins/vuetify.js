import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import { VRow } from 'vuetify/lib'
import {
  mdiMagnify,
  mdiFormatSize,
  mdiFormatListBulleted,
  mdiWhiteBalanceSunny,
  mdiArrowLeft,
  mdiDotsVertical,
  mdiTrashCanOutline,
  mdiClose,
  mdiCheckBold,
  mdiCancel,
  mdiBookshelf,
  mdiCog
} from '@mdi/js'

Vue.use(Vuetify, {
  components: { VRow }
})

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg'
  }
})

export const icon = {
  mdiArrowLeft,
  mdiMagnify,
  mdiFormatSize,
  mdiFormatListBulleted,
  mdiWhiteBalanceSunny,
  mdiDotsVertical,
  mdiTrashCanOutline,
  mdiClose,
  mdiCheckBold,
  mdiCancel,
  mdiBookshelf,
  mdiCog
}
