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
let showHeader = ref(false)
let status = 200
let reFreshDetail = ref(true)
let beforeRouterName = ref('')
const routerName = computed(() => route.name as string)
const isNoBlog = computed(() => status === 404)
let description: Ref<string | Object> = ref('Krryblog')

const linkOrAboutMap: LinkOrAboutMapType = {
  link: { params: { title: '友情链接' }, description: 'Website link' },
  about: { params: { title: '关于我' }, description: 'About me' }
}

const isOthers = computed(() =>
  Object.keys(linkOrAboutMap).includes(routerName.value)
)

// 判断第一次进来
if (isOthers.value) {
  showHeader.value = true
}

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
  // 友情链接 or 关于我，则刷新 blog-detail
  if (
    isOthers.value ||
    Object.keys(linkOrAboutMap).includes(beforeRouterName.value)
  ) {
    reFreshDetail.value = false
    nextTick(() => {
      reFreshDetail.value = true
    })
  }
  beforeRouterName.value = routerName.value
  showHeader.value = isOthers.value
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
    getBlog()
  }
})
</script>

<template>
  <main v-if="!isNoBlog">
    <section-header
      v-if="showHeader"
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
