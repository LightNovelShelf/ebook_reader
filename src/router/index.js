import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/read/:path?',
    name: 'Read',
    component: () => import('../views/ebook/index'),
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
