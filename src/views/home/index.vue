<script setup lang="ts">
import { ref, watch } from 'vue'
import { getBlog } from '@/service/api'
import { useRoute, useRouter } from 'vue-router'
// @ts-ignore
import sectionArticle from '@/components/section-article.vue'

const route = useRoute()
const router = useRouter()
let pageNo = ref(+route.params.pageIndex || 1)
let pageSize = ref(12)
let blogList = ref([])
let blogLen = ref(0)
let flag = true

const getBlogList = async () => {
  let reqData = {
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  let res: any = await getBlog(reqData)
  if (res.code === 200) {
    blogList.value = res.result.data
    blogLen.value = res.result.blogLen
  } else {
    router.push({ name: 'error' })
  }
}
getBlogList()

const changePage = async (pageNo: number) => {
  pageNo = pageNo
  await getBlogList()
  flag = false
  if (pageNo === 1) {
    router.push({ name: 'home' })
  } else {
    router.push({ name: 'homePage', params: { pageIndex: pageNo } })
  }
}

watch(route, (to, from) => {
  if (flag) {
    pageNo.value = +to.params.pageIndex || 1
    getBlogList()
  }
  flag = true
})
</script>

<template>
  <main>
    <section-article :blogList="blogList"></section-article>
  </main>
</template>

<style lang="scss" scoped>
main {
  max-width: 1080px;
  margin: 90px auto 0;
}
</style>
