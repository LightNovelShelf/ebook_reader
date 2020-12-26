import Vue from 'vue'
// import Vuetify from 'vuetify/lib/framework'
import Vuetify, { VRow } from 'vuetify/lib'
import { mdiMagnify, mdiFormatSize, mdiFormatListBulleted, mdiWhiteBalanceSunny,  mdiArrowLeft, mdiPlusBox, mdiMinusBox, mdiBookOpenPageVariant, mdiHome, mdiAccountVoice, mdiNewBox, mdiAlertBox, mdiStar, mdiHistory, mdiFire, mdiBook, mdiAccountCircle, mdiHeart, mdiEye, mdiEyeOff, mdiLoginVariant, mdiLogoutVariant, mdiAccountPlus, mdiSend, mdiLock, mdiAccount, mdiLibrary, mdiCircle, mdiPlus, mdiClose, mdiMenu, mdiChevronLeft, mdiChevronRight, mdiInformation, mdiCloseCircle, mdiSquareEditOutline, mdiContentSaveEdit, mdiEmail, mdiCog, mdiTrashCanOutline, mdiFolderEdit, mdiCheck, mdiPlusBoxMultiple, mdiFolderOpen, mdiReply, mdiArrowRightBoldBoxOutline, mdiCurrencyUsd, mdiCheckBold, mdiDotsVertical, mdiAccountAlert, mdiUpload } from '@mdi/js'
// 监控是否黑暗模式
// import schemeWatcher from './colorScheme'
Vue.use(Vuetify, {
  components: { VRow },
})
// let vuetifyObj =  new Vuetify({
//   icons: {
//       iconfont: 'mdiSvg',
//   },
//   // theme: {
//   //     dark: isDark
//   // },
// })

// Vue.use(schemeWatcher, {
//   $vuetify: vuetifyObj
// })
// export default vuetifyObj
export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  }
})
export const icon = {
  mdiArrowLeft,
  mdiMagnify,
  mdiFormatSize,
  mdiFormatListBulleted,
  mdiWhiteBalanceSunny,
  mdiPlusBox,
  mdiDotsVertical,
  mdiMinusBox,
  mdiBookOpenPageVariant,
  mdiHome,
  mdiAccountVoice,
  mdiNewBox,
  mdiAlertBox,
  mdiStar,
  mdiHistory,
  mdiFire,
  mdiBook,
  mdiAccountCircle,
  mdiHeart,
  mdiEye,
  mdiEyeOff,
  mdiLoginVariant,
  mdiLogoutVariant,
  mdiAccountPlus,
  mdiSend,
  mdiLock,
  mdiAccount,
  mdiLibrary,
  mdiCircle,
  mdiPlus,
  mdiClose,
  mdiMenu,
  mdiChevronLeft,
  mdiChevronRight,
  mdiInformation,
  mdiCloseCircle,
  mdiSquareEditOutline,
  mdiContentSaveEdit,
  mdiEmail,
  mdiCog,
  mdiTrashCanOutline,
  mdiFolderEdit,
  mdiCheck,
  mdiPlusBoxMultiple,
  mdiFolderOpen,
  mdiReply,
  mdiCurrencyUsd,
  mdiArrowRightBoldBoxOutline,
  mdiCheckBold,
  mdiAccountAlert,
  mdiUpload
}
