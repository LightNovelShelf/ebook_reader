import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/read/:name?',
    name: 'Read',
    component: () => import('../views/Read'),
    props: true
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/bookshelf',
    component: () => import('../views/Home'),
    children: [
      {
        path: 'bookshelf/:gid?',
        name: 'Bookshelf',
        component: () => import('../views/home/BookShelf.vue'),
        props: true,
      },
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('../views/home/Setting.vue'),
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router
