<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAllBlogByPage } from '@/service/api'

const route: any = useRoute()
const router = useRouter()

const blogList = ref([])
const blogLen = ref(0)
const status = ref(200)
const pageNo = ref(+route.query.page || 1)
const pageSize = ref(10)
let flag = true

const isEmpty = computed(() => status.value === 404)

const getBlog = async () => {
  let reqData = {
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  let res: any = await getAllBlogByPage(reqData)
  status.value = res.code
  // 404 的标题在 axios 拦截器已经定义
  if (status.value === 200) {
    // 将点击数和评论数合并
    for (let val of res.result.data) {
      let hitComment = `${val.hit} / ${val.comment}`
      delete val.hit
      delete val.comment
      val.hitComment = hitComment
    }
    blogList.value = res.result.data
    blogLen.value = res.result.blogLen
  }
}
const handleChangeBlog = (reqData: any) => {
  let params = Object.keys(reqData).filter((item) => item !== 'id')
  let id = reqData.id
  let key = params[0]
  for (let val of blogList.value as any) {
    if (val.id === id) {
      val[key] = reqData[key]
      break
    }
  }
}
const deleteBlog = (id: number) => {
  blogList.value = blogList.value.filter((item: any) => item.id !== id)
  --blogLen.value
  if (blogList.value.length === 0) {
    pageNo.value = --pageNo.value > 0 ? pageNo.value : 1
    getBlog()
  }
}
const changePage = async (pageIndex: number) => {
  pageNo.value = pageIndex
  await getBlog()
  flag = false
  let query = pageIndex === 1 ? {} : { page: pageIndex }
  router.push({ name: 'list', query: query })
}
const changePageSize = (val: number) => {
  pageSize.value = val
  changePage(1)
}

getBlog()

watch(route, (to, from) => {
  if (flag && to.name === 'list') {
    pageNo.value = +to.query.page || 1
    getBlog()
  }
  flag = true
})
</script>

<template>
  <main v-if="!isEmpty">
    <el-pagination
      v-if="blogLen > pageSize"
      v-model:currentPage="pageNo"
      :page-size="pageSize"
      layout="prev, pager, next, sizes, jumper"
      :total="blogLen"
      @current-change="changePage"
      @size-change="changePageSize"
    ></el-pagination>
  </main>
  <not-found v-else></not-found>
</template>

<style lang="scss" scoped></style>
