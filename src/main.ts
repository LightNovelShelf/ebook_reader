import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/style/main.scss'
import router from './router'
import { naive } from './plugins/naive-ui'
import VueHotkey from 'v-hotkey'
import { ClickOutside, Intersect } from 'vuetify/lib/directives/index'

const app = createApp(App)

app.directive('hotkey', {
  beforeMount: VueHotkey.directive.bind,
  updated: VueHotkey.directive.componentUpdated,
  unmounted: VueHotkey.directive.unbind
})
app.directive('intersect', Intersect)
app.directive('click-outside', ClickOutside)

app.use(createPinia()).use(router).use(naive).mount('#app')
