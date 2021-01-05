import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/read/:uri?/:name?',
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
        component: () => import('../views/Home/BookShelf.vue'),
        props: true,
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

export default router
