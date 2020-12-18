import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/read',
    name: 'Read',
    component: () => import('../views/ebook/index'),
  }
]

const router = new VueRouter({
  routes
})

export default router
