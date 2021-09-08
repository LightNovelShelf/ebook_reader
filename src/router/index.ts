import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/read/:name?',
    name: 'read',
    component: () => import('../views/Read.vue'),
    props: true
  },
  {
    path: '/',
    name: 'home',
    redirect: '/bookshelf',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: 'bookshelf/:gid?',
        name: 'bookshelf',
        component: () => import('../views/home/BookShelf.vue'),
        props: true
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('../views/home/Setting.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
