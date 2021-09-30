import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/style/main.scss'
import router from './router'
import { naive } from './plugins/naive-ui'
import VueHotkey from 'v-hotkey'
import { ClickOutside, Intersect, Mutate } from 'vuetify/lib/directives/index'
import { default as NIcon } from '@/plugins/naive-ui/components/Icon.vue'
import 'vuetify/lib/styles/generic/_transitions.scss'

const app = createApp(App)

app.directive('hotkey', {
  beforeMount: VueHotkey.directive.bind,
  updated: VueHotkey.directive.componentUpdated,
  unmounted: VueHotkey.directive.unbind
})
app.directive('intersect', Intersect)
app.directive('click-outside', ClickOutside)
app.directive('mutate', Mutate)
app.component('n-icon', NIcon)

app.use(createPinia()).use(router).use(naive).mount('#app')
