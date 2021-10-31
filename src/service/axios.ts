'use strict'

import axios from 'axios'
// import iView from 'iview'
import router from '@/router'
import store from '@/store'
import { codeStatus } from '@/util/enum'

const origin = window.location.protocol + '//' + window.location.hostname

// 自动识别接口使用开发环境地址（开发环境地址做了 proxyTable 代理，故设置为空）或线上地址
const baseURL = ''
// 开发环境直接打包测试
// axios.defaults.baseURL = '';

const $axios = axios.create({
  baseURL: baseURL,
  timeout: 20000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' }
})

const noLoading = [
  'getClassify',
  'getAllBlog',
  'getMusic',
  'getSummarizedData',
  'getReviseList'
]

$axios.interceptors.request.use(
  (config: any) => {
    console.log(1212, config.url)
    // 判断请求是否是 getClassify，如果是 getClassify，不加载 LoadingBar
    const url = config.url
    if (!noLoading.includes(url.split('/').pop())) {
      store.dispatch('blog/ALLLOADING', true)
    }
    return config
  },
  (error: any) => {
    console.log(error)
    return Promise.reject(error)
  }
)

$axios.interceptors.response.use(
  (res: any) => {
    const apiRes = res.data
    switch (+apiRes.code) {
      case codeStatus.NOTFOUND:
        document.title = '404 - 找不到页面'
        // 可以在这里直接设置跳转到 404 页面，已经不需要啦，在组件中已经设置，为了不改变 url，实现转发的效果
        // router.push({name: 'error'})
        break
      case codeStatus.UNAUTHORIZED: {
        store.dispatch('user/CLEARUSER')
        sessionStorage.clear()
        const returnUrl = window.location.href
        router.push({
          name: 'login',
          query: { returnUrl }
        })
        break
      }
      default:
        break
    }
    store.dispatch('blog/ALLLOADING', false)
    return apiRes
  },
  async (error: any) => {
    store.dispatch('blog/ALLLOADING', false)
    console.dir(error)
    return Promise.reject(error)
  }
)

export default $axios
