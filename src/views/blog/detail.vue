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
  params: { title: string }
  description: string
}
interface LinkOrAboutMapType {
  [propName: string]: ObjectType
}

const route = useRoute()
const blog: Ref<BlogItemType> = ref({})
const status = ref(200)
const reFreshDetail = ref(true)
const routerName = computed(() => route.name as string)
const isNoBlog = computed(() => status.value === 404)

const linkOrAboutMap: LinkOrAboutMapType = {
  link: { params: { title: '友情链接' }, description: 'Website link' },
  about: { params: { title: '关于我' }, description: 'About me' }
}

const isOthers = computed(() =>
  Object.keys(linkOrAboutMap).includes(routerName.value)
)
const description = computed(() =>
  isOthers.value ? linkOrAboutMap[routerName.value].description : 'Krryblog'
)
const headerTitle = computed(() =>
  isOthers.value ? linkOrAboutMap[routerName.value].params.title : 'Krryblog'
)

const { proxy }: any = getCurrentInstance()
const documentTitle = proxy.documentTitle
const getBlog = async () => {
  const id = route.params['id']
  const res: any = await (isOthers.value
    ? getLinkOrAbout(linkOrAboutMap[routerName.value].params)
    : getBlogDetail(id))
  status.value = res.code
  // 404 的标题在 axios 拦截器已经定义
  if (status.value === 200) {
    blog.value = res.result.data
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
    blog.value = {}
    getBlog()
    // 友情链接 or 关于我，则刷新 blog-detail
    if (isOthers.value) {
      reFreshDetail.value = false
      nextTick(() => {
        reFreshDetail.value = true
      })
    }
  }
})
</script>

<template>
  <main v-if="!isNoBlog">
    <section-header
      v-if="isOthers"
      :title="headerTitle"
      :description="description"
    ></section-header>
    <blog-detail
      v-if="reFreshDetail"
      :blog="blog"
      :has-show-header="!isOthers"
      @clearBlog="clearBlog"
    ></blog-detail>
  </main>
  <not-found v-else></not-found>
</template>

<style lang="scss" scoped></style>
