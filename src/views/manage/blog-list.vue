<script setup lang="ts">
import { ref, watch, Ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElLoading, ElMessage } from 'element-plus'
import {
  getAllBlogByPage,
  updateBlogNoTime,
  getLogout,
  updateConfig
} from '@/service/api'
import personalInfo from './modules/personal-info.vue'
import Cookies from 'js-cookie'

const route: any = useRoute()
const router = useRouter()

interface BlogListType {
  [propName: string]: string | number
}

const blogList: Ref<BlogListType[]> = ref([])
const blogLen = ref(0)
const status = ref(200)
const pageNo = ref(+route.query.page || 1)
const pageSize = ref(10)
let flag = true
let loadingInstance = null
const getLoadingOpt = (text = 'Loading') => ({
  lock: true,
  text
})

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
    animeCover.value = res.result.config?.animeCover ?? 1
  }
}
const handleChangeBlog = (reqData: any) => {
  let params = Object.keys(reqData).filter((item) => item !== 'id')
  let id = reqData.id
  let key = params[0]
  for (let val of blogList.value) {
    if (val.id === id) {
      val[key] = reqData[key]
      break
    }
  }
}
const deleteBlog = (id: number) => {
  blogList.value = blogList.value.filter((item: BlogListType) => item.id !== id)
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

const userName = computed(() => Cookies.get('username'))

const Logout = () => {
  ElMessageBox.confirm('Do you want to logout ？', 'notification~', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      await getLogout()
      router.push('/')
    })
    .catch(() => {})
}

const showModel = ref(false)
const showDialog = () => {
  showModel.value = true
}
const closeDialog = () => {
  showModel.value = false
}

// 设置发布状态
const setStatus = async (val: number, id: number) => {
  console.log(id, val)
  loadingInstance = ElLoading.service(getLoadingOpt('Modifying~~'))
  let reqData = {
    id: id,
    status: val ? 1 : 0
  }
  let msg: any = await updateBlogNoTime(reqData)
  if (msg === 'success') {
    // 同步已查询出来的数据
    handleChangeBlog(reqData)
    ElMessage.success('Modified success!')
  } else {
    ElMessage.error('Error, Failure to Modify...')
  }
  loadingInstance.close()
}
// 设置置顶状态
const setIsTop = async (val: number, id: number) => {
  console.log(id, val)
  let reqData = {
    id: id,
    isTop: val ? 1 : 0
  }
  let loadMsg = reqData.isTop ? 'Topping~~' : 'No topping~~'
  loadingInstance = ElLoading.service(getLoadingOpt(loadMsg))
  let msg: any = await updateBlogNoTime(reqData)
  if (msg === 'success') {
    // 同步已查询出来的数据
    handleChangeBlog(reqData)
    ElMessage.success('Modified success!')
  } else {
    ElMessage.error('Error, Failure to Modify...')
  }
  loadingInstance.close()
}
const beforeRemove = (id: number, title: string) => {
  console.log('删除id：' + id)
  ElMessageBox.confirm(
    `Do you want to delete the blog “${title}” ？`,
    'notification~',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  )
    .then(async () => {
      remove(id)
    })
    .catch(() => {})
}
const remove = async (id: number) => {
  loadingInstance = ElLoading.service(getLoadingOpt('Deleting~~'))
  let reqData = {
    id: id,
    isDelete: 1
  }
  let msg: any = await updateBlogNoTime(reqData)
  if (msg === 'success') {
    // refresh local data
    deleteBlog(id)
    ElMessage.success('Delete successful!')
  } else {
    ElMessage.error('Error, Failure to delete...')
  }
  loadingInstance.close()
}
// 二次元封面开关
const animeCover = ref(1)
const changeConfig = async (val: number) => {
  const { result } = await updateConfig({ id: 1, animeCover: val })
  result
    ? ElMessage.success('Modified success!')
    : ElMessage.error('Error, Failure to Modify...')
}
</script>

<template>
  <main v-if="!isEmpty">
    <section class="list">
      <h1>Wellcome {{ userName }}</h1>
      <div class="list-link">
        <router-link :to="{ name: 'edit' }">
          <el-button type="success" class="add-button">Add</el-button>
        </router-link>
        <div class="left-switch">
          二次元封面：
          <el-switch
            v-model="animeCover"
            :inactive-value="0"
            :active-value="1"
            @change="changeConfig"
          />
        </div>
        <a href="javascript:void(0)" class="modify-buttom" @click="Logout"
          >Logout</a
        >
        <a href="javascript:void(0)" class="modify-buttom" @click="showDialog"
          >Modify Personal Information</a
        >
        <router-link :to="{ name: 'music' }" class="modify-buttom"
          >Go to music</router-link
        >
      </div>
      <el-table :data="blogList" stripe border class="list-table">
        <el-table-column prop="id" label="ID" width="58"></el-table-column>
        <el-table-column prop="title" label="Title" width="150">
          <template #default="scope">
            <router-link :to="`/${scope.row.id}`">{{
              scope.row.title
            }}</router-link>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Archive" width="97">
          <template #default="scope">
            <router-link :to="`/category/${scope.row.classifyId}`">{{
              scope.row.classify
            }}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="Author"
          width="76"
        ></el-table-column>
        <el-table-column prop="label" label="Label" width="106">
          <template #default="scope">
            <div v-if="scope.row.label">
              <router-link
                v-for="(ele, index) in scope.row.label.split(',')"
                :key="index"
                class="lable-name"
                :to="`/tag/${ele}`"
                >{{ ele }}</router-link
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="hitComment"
          label="Clicks &nbsp;&nbsp;/ Comment"
          width="94"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="CreateTime"
          width="104"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="UpdateTime"
          width="107"
        ></el-table-column>
        <el-table-column prop="status" label="Status" width="81">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :inactive-value="0"
              :active-value="1"
              @change="setStatus($event, scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="isTop" label="Top" width="81">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isTop"
              :inactive-value="0"
              :active-value="1"
              @change="setIsTop($event, scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="125">
          <template #default="scope">
            <router-link
              class="a-button"
              :to="{
                name: 'edit',
                query: {
                  id: scope.row.id
                }
              }"
              >Modify</router-link
            >
            <el-button
              type="text"
              class="a-button"
              @click="beforeRemove(scope.row['id'], scope.row['title'])"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="blogLen > pageSize"
        v-model:currentPage="pageNo"
        :page-size="pageSize"
        layout="prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 50]"
        :total="blogLen"
        @current-change="changePage"
        @size-change="changePageSize"
      ></el-pagination>
      <personal-info
        :show-model="showModel"
        @closeDialog="closeDialog"
      ></personal-info>
    </section>
  </main>
  <not-found v-else></not-found>
</template>

<style lang="scss" scoped>
section {
  width: 1080px;
  padding: 90px 0 0;
  margin: 0 auto;
  animation: fadeIn 0.6s linear;

  h1 {
    margin-top: 20px;
    font-size: 36px;
    color: #ff5050;
    text-align: center;
    text-shadow: 1px 1px 2px #adadad;
  }

  .add-button {
    float: left;
    width: 80px;
    height: 32px;
    min-height: 30px;
    font-size: 12px;
    line-height: 0;
    background: #19be6b;
  }

  .modify-buttom {
    float: right;
    margin-left: 18px;
  }

  .list-link {
    overflow: hidden;
    line-height: 32px;

    .left-switch {
      display: flex;
      align-items: center;
      float: left;
      margin-left: 18px;
    }
  }

  .list-table {
    margin-top: 18px;
    font-size: 12px;

    .lable-name {
      display: inline-block;

      &:not(:last-child) {
        margin-right: 10px;
      }
    }

    .a-button {
      &:last-child {
        margin-left: 4px;
      }

      &:first-child {
        margin-right: 4px;
      }

      &:hover {
        color: #2d8cf0 !important;
      }

      font-size: 12px;
      color: #5cadff;
    }
  }
}

.list :deep(.el-table) {
  .cell {
    display: -webkit-box;
    padding: 0 18px !important;
    overflow: hidden;
    line-height: 1.5;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .el-table__cell {
    padding: 8px 0;
  }
}
</style>
