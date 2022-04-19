'use strict'

import axios from 'axios'
import router from '@/router'
import store from '@/store'
import { codeStatus } from '@/util/enum'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/util'

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
    // 判断加入 token
    const token = Cookies.get('token')
    if (token) {
      Object.assign(config.headers, {
        Authorization: `Bearer ${token}`
      })
    }
    const csrftoken = Cookies.get('csrfToken')
    if (csrftoken) {
      Object.assign(config.headers, {
        'x-csrf-token': csrftoken
      })
    }
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
        ElMessage.error(res.data.message || '未登录')
        Cookies.remove('username')
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
    // 服务端响应数据
    const res = error.response
    console.dir(res)
    if (res.status === codeStatus.UNAUTHORIZED) {
      ElMessage.error(res.data.message || '未登录')
      Cookies.remove('username')
      const returnUrl = window.location.href
      // 跳转到登录页
      router.push({
        name: 'login',
        query: { returnUrl }
      })
    }
    return Promise.reject(error)
  }
)

export default $axios
