<script setup lang="ts">
import { ref, Ref, getCurrentInstance, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogDetail, getLinkOrAbout } from '@/service/api'
import blogDetail from '@/components/blog-detail.vue'
import sectionHeader from '@/components/section-header.vue'

interface BlogItemType {
  [propName: string]: string | number
}
interface ObjectType {
  [propName: string]: Object | string
}
interface LinkOrAboutMapType {
  [propName: string]: ObjectType
}

const route = useRoute()
let blog: Ref<BlogItemType> = ref({})
let status = 200
let reFresh = ref(true)
let reFreshDetail = ref(true)
let beforeRouterName = ref(route.name)

const isNoBlog = computed(() => status === 404)

let description: Ref<string | Object> = ref('')
const routerName = computed(() => route.name as string)

const linkOrAboutMap: LinkOrAboutMapType = {
  link: { params: { title: '友情链接' }, description: 'Website link' },
  about: { params: { title: '关于我' }, description: 'About me' }
}
const beforeCurrentSame = computed(() => {
  const linkOrAboutMapKeys = Object.keys(linkOrAboutMap)
  return (
    linkOrAboutMapKeys.includes(beforeRouterName.value as string) &&
    linkOrAboutMapKeys.includes(route.name as string)
  )
})
const isOthers = computed(() =>
  Object.keys(linkOrAboutMap).includes(routerName.value)
)

const { proxy }: any = getCurrentInstance()
const documentTitle = proxy.documentTitle
const getBlog = async () => {
  const id = route.params['id']
  const res: any = await (isOthers.value
    ? getLinkOrAbout(linkOrAboutMap[routerName.value].params)
    : getBlogDetail(id))
  status = res.code
  blog.value = res.result.data
  // 保证接口数据返回赋值
  description.value = isOthers.value
    ? linkOrAboutMap[routerName.value].description
    : ''
  reFresh.value = true
  // 路由前后都是友情链接 or 关于我，则刷新 blog-detail
  if (beforeCurrentSame.value) {
    reFreshDetail.value = false // 刷新 detail
    nextTick(() => {
      reFreshDetail.value = true
    })
  }
  // 404 的标题在 axios 拦截器已经定义
  if (status === 200) {
    document.title = `${blog.value.title} - ${documentTitle}`
  }
}

getBlog()

const clearBlog = () => {
  blog.value = {}
}

watch(route, (to) => {
  const currentName = to.name as string
  if ([...Object.keys(linkOrAboutMap), 'blog'].includes(currentName)) {
    // 路由前后都是友情链接 or 关于我，则不刷新 section-header
    reFresh.value = beforeCurrentSame.value
    beforeRouterName.value = to.name as string
    getBlog()
  }
})
</script>

<template>
  <main v-if="!isNoBlog">
    <section-header
      v-if="isOthers && reFresh"
      :title="blog.title"
      :description="description"
    ></section-header>
    <blog-detail
      v-if="reFreshDetail"
      :blog="blog"
      @clearBlog="clearBlog"
    ></blog-detail>
  </main>
  <not-found v-else></not-found>
</template>

<style lang="scss" scoped></style>
