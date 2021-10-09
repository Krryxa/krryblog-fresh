import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import components from './components'

import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.basePath =
  window.location.protocol + '//' + window.location.hostname

app.config.globalProperties.documentTitle = '你的美好，我都记得'

// 注册全局组件
Object.keys(components).forEach((key) => {
  app.component(key, components[key])
})

app.use(router).use(store).use(ElementPlus).mount('#app')
