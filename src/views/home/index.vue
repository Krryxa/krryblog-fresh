<script setup lang="ts">
import { ref, watch, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { configMap } from './config'
import sectionHeader from '@/components/section-header.vue'
import sectionArticle, {
  SectionArticleType
} from '@/components/section-article.vue'
import noResult from './no-result.vue'

const route: any = useRoute()
const router = useRouter()
const routerName = computed(() => route.name)
const { proxy }: any = getCurrentInstance()
const documentTitle = proxy.documentTitle
// 获取首页、标签页、搜索页相关配置
const config = computed(() =>
  routerName.value ? configMap[routerName.value] : ''
)

const sectionArticleRef = ref<SectionArticleType>()
const main_margintop = ref('90px')
const article_paddingtop = ref('')
const showHeader = ref(true)
const headerTitle = ref('')
const description = ref(
  config.value.header ? config.value.header.description : ''
)
const animeCover = ref(1)
// 设置标题
const setHeaderTitle = () => {
  const configTitle = config.value?.header?.title
  if (configTitle) {
    if (configTitle.name) {
      headerTitle.value = configTitle.name
    } else {
      const id = +route.params[configTitle.param]
      headerTitle.value = configTitle.map[id]
    }
  }
}
const setStyle = () => {
  main_margintop.value = config.value.header ? '' : '90px'
  article_paddingtop.value = config.value.header ? '20px' : ''
  showHeader.value = !!config.value.header
  setHeaderTitle()
}
setStyle()

const pageSize = computed(() => config.value.pageSize || 12)
const pageNo = ref(
  +route[config.value.pageParamType][config.value.pageParamName] || 1
)
const blogList = ref([])
const blogLen = ref(0)
let flag = true
const status = ref(200)

const hasNoResult = computed(() => status.value === 406)
const isEmpty = computed(() => status.value === 404)

const getBlogList = async () => {
  let reqData = {
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  if (config.value.paramMap) {
    const paramsMapList = Object.entries(config.value.paramMap)
    for (const [paramName, routeParam] of paramsMapList) {
      const reqParam = route.params[routeParam as string] as string
      !config.value.header.title && (headerTitle.value = reqParam)
      reqData = Object.assign({}, reqData, {
        [paramName]: reqParam
      })
    }
  }
  config.value.header && (description.value = config.value.header.description)
  let res: any = await config.value.api(reqData)
  status.value = res.code
  // 设置标题
  if (config.value.title) {
    document.title = config.value.title
      .replace('$param', headerTitle.value)
      .replace('$documentTitle', documentTitle)
  }
  if (res.code === 200) {
    blogList.value = res.result.data
    blogLen.value = res.result.blogLen
    animeCover.value = res.result.config?.animeCover ?? 1
  }
  if (hasNoResult.value) {
    blogLen.value = 0
  }
}
getBlogList()

const changePage = async (pageIndex: number) => {
  pageNo.value = pageIndex
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
  // 重置博客列表为骨架屏
  sectionArticleRef.value?.initBlogList(config.value.defaultNum || 3)
  getBlogList()
}

watch(route, (to, from) => {
  if (flag && config.value) {
    pageNo.value =
      +to[config.value.pageParamType][config.value.pageParamName] || 1
    blogLen.value = 0 // 重置分页数量
    status.value = 200 // 消除 hasNoResult 的影响
    // 重置博客列表为骨架屏
    sectionArticleRef.value?.initBlogList(config.value.defaultNum || 3)
    setStyle()
    getBlogList()
  }
  flag = true
})
</script>

<template>
  <main v-if="!isEmpty">
    <section-header
      v-if="showHeader"
      :title="headerTitle"
      :description="description"
    ></section-header>
    <section-article
      v-show="!hasNoResult"
      ref="sectionArticleRef"
      :blog-list="blogList"
      :default-num="config.defaultNum"
      :anime-cover="animeCover"
      class="wrapper"
    ></section-article>
    <no-result v-show="hasNoResult"></no-result>
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
  <not-found v-else></not-found>
</template>
<style lang="scss" scoped>
main {
  margin-top: v-bind(main_margintop);
}

.wrapper {
  padding-top: v-bind(article_paddingtop);
}
</style>
