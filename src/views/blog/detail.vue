<script setup lang="ts">
import { ref, Ref, getCurrentInstance, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogDetail } from '@/service/api'
import blogDetail from '@/components/blog-detail.vue'

interface BlogItemType {
  [propName: string]: string | number
}

let blog: Ref<BlogItemType> = ref({})
let status = 200
const isNoBlog = computed(() => status === 404)
const route = useRoute()

const { proxy }: any = getCurrentInstance()
const documentTitle = proxy.documentTitle
const getBlog = async () => {
  let id = route.params['id']
  let res: any = await getBlogDetail(id)
  status = res.code
  blog.value = res.result.data
  // 404 的标题在 axios 拦截器已经定义
  if (status === 200) {
    document.title = `${blog.value.title} - ${documentTitle}`
  }
}

getBlog()

const clearBlog = () => {
  blog.value = {}
}

watch(route, () => {
  getBlog()
})
</script>

<template>
  <main v-if="!isNoBlog">
    <blog-detail :blog="blog" @clearBlog="clearBlog"></blog-detail>
  </main>
  <not-found v-else></not-found>
</template>

<style lang="scss" scoped></style>
