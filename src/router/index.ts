import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: 'Krryblog' }
  },
  {
    path: '/page/:pageIndex(\\d+)',
    component: () => import('@/views/home/index.vue'),
    name: 'homePage',
    meta: { title: 'Krryblog' }
  },
  {
    path: '/:id(\\d+)',
    component: () => import('@/views/blog/detail.vue'),
    name: 'blog'
  },
  {
    path: '/2',
    redirect: '/link'
  },
  {
    path: '/3',
    redirect: '/about'
  },
  {
    path: '/:id(\\d+)',
    component: () => import('@/views/blog/detail.vue'),
    name: 'blog'
  },
  {
    path: '/archive',
    component: () => import('@/views/blog/detail.vue'),
    name: 'archive',
    meta: { title: '时间归档' }
  },
  {
    path: '/stars',
    component: () => import('@/views/blog/detail.vue'),
    name: 'stars',
    meta: { title: '星茶会' }
  },
  {
    path: '/category/:id(\\d+)/:page?',
    component: () => import('@/views/blog/detail.vue'),
    name: 'category'
  },
  {
    path: '/tag/:name/:page?',
    component: () => import('@/views/home/index.vue'),
    name: 'tag'
  },
  {
    path: '/search/:keyword/:page?',
    component: () => import('@/views/home/index.vue'),
    name: 'search'
  },
  {
    path: '/about',
    component: () => import('@/views/blog/detail.vue'),
    name: 'about',
    meta: { title: '关于我' }
  },
  {
    path: '/link',
    component: () => import('@/views/blog/detail.vue'),
    name: 'link',
    meta: { title: '友情链接' }
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})
