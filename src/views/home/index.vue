<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { configMap } from './config'
import sectionHeader from '@/components/section-header.vue'
import sectionArticle from '@/components/section-article.vue'

const route: any = useRoute()
const router = useRouter()
const routerName = computed(() => route.name)
// 获取首页、标签页、搜索页相关配置
const config = computed(() =>
  routerName.value ? configMap[routerName.value] : ''
)

let mainMarginTop = ref('')
let articlePaddingTop = ref('')
let showHeader = ref(true)
const setStyle = () => {
  mainMarginTop.value = config.value.header ? '' : '90px'
  articlePaddingTop.value = config.value.header ? '20px' : ''
  showHeader.value = !!config.value.header
}
setStyle()

let pageSize = computed(() => config.value.pageSize || 12)
let pageNo = ref(
  +route[config.value.pageParamType][config.value.pageParamName] || 1
)
let blogList = ref([])
let blogLen = ref(0)
let flag = true
let headerTitle = ref('')

const getBlogList = async () => {
  let reqData = {
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  if (config.value.paramMap) {
    const paramsMapList = Object.entries(config.value.paramMap)
    for (const [paramName, routeParam] of paramsMapList) {
      headerTitle.value = route.params[routeParam as string] as string
      reqData = Object.assign({}, reqData, {
        [paramName]: headerTitle.value
      })
    }
  }
  let res: any = await config.value.api(reqData)
  if (res.code === 200) {
    blogList.value = res.result.data
    blogLen.value = res.result.blogLen
    setStyle()
  } else {
    router.push({ name: 'error' })
  }
}
getBlogList()

const changePage = async (pageIndex: number) => {
  pageNo.value = pageIndex
  await getBlogList()
  flag = false
  if (routerName.value === 'home' || routerName.value === 'homePage') {
    if (pageIndex === 1) {
      router.push({ name: 'home' })
    } else {
      router.push({ name: 'homePage', params: { pageIndex: pageIndex } })
    }
  } else {
    const query = pageNo.value === 1 ? {} : { page: pageNo.value }
    router.push({ name: routerName.value as string, query })
  }
}

watch(route, (to, from) => {
  if (flag && config.value) {
    pageNo.value = +to.params.pageIndex || 1
    getBlogList()
  }
  flag = true
})
</script>

<template>
  <main>
    <section-header
      v-if="showHeader"
      :title="headerTitle"
      :description="config.header.description"
    ></section-header>
    <section-article :blog-list="blogList" class="wrapper"></section-article>
    <el-pagination
      v-if="blogLen > pageSize"
      v-model:currentPage="pageNo"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="blogLen"
      @current-change="changePage"
    >
    </el-pagination>
  </main>
</template>
<style lang="scss" scoped>
main {
  margin-top: v-bind(mainmargintop);
}

.wrapper {
  padding-top: v-bind(articlepaddingtop);
}
</style>
