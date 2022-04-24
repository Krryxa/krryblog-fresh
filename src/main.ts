import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import components from '@/components/i1ndex'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'

import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.basePath =
  window.location.protocol + '//' + window.location.hostname

app.config.globalProperties.documentTitle = '你的美好，我都记得'

// 注册全局组件
Object.keys(components).forEach((key) => {
  app.component(key, components[key])
})

router.beforeEach((to, from, next) => {
  const toRouteName = to.name
  const username = Cookies.get('username')
  if (toRouteName === 'login') {
    if (username) {
      // 已登录，进入列表页
      next({ name: 'list' })
    } else {
      next()
    }
  } else if (to.meta.requireAuth) {
    // 如果需要进入需登录的页面
    if (username) {
      // 已登录，进入下一个页面
      next()
    } else {
      // 否则进入登录页面
      ElMessage.error('请您先登录')
      next({
        name: 'login',
        query: { returnUrl: window.location.href }
      })
    }
  } else {
    next()
  }
})

// 配置页面标题
router.afterEach((to, from) => {
  if (to.meta && to.meta.title) {
    document.title = (
      to.meta.cover
        ? to.meta.title
        : to.meta.title + ' - ' + app.config.globalProperties.documentTitle
    ) as string
  }
})

app.use(router).use(createPinia()).mount('#app')
