import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import Navigation from 'vue-navigation'


Vue.config.productionTip = false
Vue.use(Viewer, {
  defaultOptions: {
    navbar: false
  }
})

Vue.use(Navigation, {router})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
