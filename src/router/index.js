import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Main',
    redirect: '/home',
    component: () => import('../views/Main'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Main/Home.vue')
      },
      {
        path: 'read',
        name: 'Read',
        component: () => import('../views/ebook/index'),
      }
    ]
  }
]
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
}
const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition
    } else {
        return {x: 0, y: 0}
    }
  }
})

export default router