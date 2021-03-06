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
    path: '/archive',
    component: () => import('@/views/archive/archive.vue'),
    name: 'archive',
    meta: { title: '时间归档' }
  },
  {
    path: '/stars',
    component: () => import('@/views/archive/archive.vue'),
    name: 'stars',
    meta: { title: '风雨记录' }
  },
  {
    path: '/love/:page?',
    component: () => import('@/views/home/index.vue'),
    name: 'love',
    meta: { title: '双 K 之恋' }
  },
  {
    path: '/category/:id(\\d+)/:page?',
    component: () => import('@/views/home/index.vue'),
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
  },
  {
    path: '/login/:returnUrl?',
    component: () => import('@/views/manage/login.vue'),
    name: 'login',
    meta: { title: '管理员登录', keepAlive: true }
  },
  {
    path: '/manage/list/:page?',
    component: () => import('@/views/manage/blog-list.vue'),
    name: 'list',
    meta: { title: '后台中心', requireAuth: true }
  },
  {
    path: '/manage/music',
    component: () => import('@/views/manage/music-list.vue'),
    name: 'music',
    meta: { title: '音乐', requireAuth: true }
  },
  {
    path: '/manage/edit/:id?',
    component: () => import('@/views/manage/blog-edit.vue'),
    name: 'edit',
    meta: { title: '新增博客', requireAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/components/not-found.vue'),
    name: 'NotFound',
    meta: { title: '404 - 找不到页面', cover: true }
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})
