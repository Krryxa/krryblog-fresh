<script setup lang="ts">
import { ref, Ref, getCurrentInstance, computed } from 'vue'
import { mavonEditor } from 'mavon-editor'
import { useRouter, useRoute } from 'vue-router'
import { useBlogStore } from '@/store/blog'
import { ElLoading, ElMessage } from 'element-plus'
import editUpload from './modules/edit-upload.vue'
import '@/assets/css/markdown.css'
// import '@/assets/css/github.css'
import 'mavon-editor/dist/css/index.css'
import {
  getEditBlogDetail,
  updateBlog,
  addBlog,
  getBlogCount,
  uploadContent,
  deleteFile
} from '@/service/api'
import Cookies from 'js-cookie'

interface FileListType {
  name: string
  url: string
}

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const id = ref(route.query.id || 0)
const title = ref('')
const markdownDesc = ref('')
const translateDesc = ref('')
const description = ref('')
const imgName = ref('')
const uploadImgUrl = ref('')
const uploadWebpImgUrl = ref('')
const classifyId = ref(1)
const label = ref('')
const statusFlag = ref(true)
const isLove = ref(0)
const defaultUpload: Ref<FileListType[]> = ref([])
const defaultUploadWebp: Ref<FileListType[]> = ref([])

const status = computed(() => +statusFlag.value)
// 从接口查询出分类
const classifyList = computed(() => blogStore.classify)
// 获取用户 ID
const userId = computed(() => +Cookies.get('id'))

const getBlogInfo = async () => {
  // get blog when edit
  document.title = document.title.replace('新增', '编辑')

  let res: any = await getEditBlogDetail(id.value)
  let status = res.code
  let blogObj = res.result.data
  // 404 的标题在 axios 拦截器已经定义
  if (status === 200) {
    title.value = blogObj['title']
    markdownDesc.value = blogObj['content_md']
    statusFlag.value = !!blogObj['status']
    description.value = blogObj['description']
    classifyId.value = blogObj['classifyId']
    label.value = blogObj['label']
    isLove.value = blogObj.isLove

    imgName.value = blogObj.imageName
    uploadImgUrl.value = blogObj.image
    uploadWebpImgUrl.value = blogObj.imageWebp
    defaultUpload.value = getDefaultUploadList(uploadImgUrl.value)
    defaultUploadWebp.value = getDefaultUploadList(uploadWebpImgUrl.value)
  }
}

const getDefaultUploadList = (url: string) =>
  url
    ? [
        {
          name: imgName.value,
          url: window.location.origin + '/' + url
        }
      ]
    : []

const blogCount = ref(0)
const getBlogCounting = async () => {
  blogCount.value = await getBlogCount()
}

if (id.value) {
  getBlogInfo()
} else {
  // 新增查博客总数，用于 markdown 上传图片时文件夹的命名id
  getBlogCounting()
}
// 临时 id
const tempId = computed(() => id.value || blogCount.value + 1)

const { proxy }: any = getCurrentInstance()
const basePath = proxy.basePath
const mdEditRef: any = ref(null)
const addImg = async (pos: any, $file: File) => {
  let formData = new FormData()
  formData.append('imgFile', $file)

  let result: any = await uploadContent(tempId.value, formData)
  mdEditRef.value.$img2Url(pos, basePath + '/' + result.url)
}

let loadingInstance = null

const delImg = async (fileArr: any[]) => {
  loadingInstance = ElLoading.service({ lock: true, text: 'Deleting~~' })
  // fileArr: ['http://...', { name: 'xxx', ... }]

  let res: any = await deleteFile({
    filePath: `upload/content/${tempId.value}/${fileArr[1].name}`
  })
  if (res === 'success') {
    ElMessage.success('删除成功！')
  } else {
    ElMessage.error(res || '删除失败！')
  }
  loadingInstance.close()
}

// markdown save
const markdownSave = (value: string, render: string) => {
  markdownDesc.value = value
  translateDesc.value = render
}

// from child
const changeImg = (name: string, url: string) => {
  imgName.value = name
  uploadImgUrl.value = url
}
const changeWebpImg = (name: string, url: string) => {
  uploadWebpImgUrl.value = url
}

// save and commit
const beforeCommit = () => {
  let markdownSaveBtn = document.getElementsByClassName(
    'fa-mavon-floppy-o'
  )[0] as HTMLElement
  markdownSaveBtn.click()
  if (title.value.trim() === '') {
    ElMessage.warning('先输入博客标题哦~~')
  } else if (translateDesc.value.trim() === '') {
    ElMessage.warning('先输入博客内容哦~~')
  } else if (description.value.trim() === '') {
    ElMessage.warning('先简单描述一下博客哦~~')
  } else if (uploadImgUrl.value === '') {
    ElMessage.warning('先上传封面图片 AVIF 哦~~')
  } else {
    let reqData = convertParams()
    commit(reqData)
  }
}
const commit = async (reqData: any) => {
  console.log(reqData)
  loadingInstance = ElLoading.service({ lock: true, text: 'Saving~~' })
  if (id.value > 0) {
    // is edit
    console.log('是编辑，id：' + id.value)
    reqData = Object.assign({}, reqData, { id: id.value })
    console.log(reqData)
    let msg: any = await updateBlog(+id.value, reqData)
    if (msg === 'success') {
      router.push(`/${id.value}`)
    } else {
      ElMessage.error('出错了呢，修改失败...')
    }
  } else {
    let id = await addBlog(reqData)
    console.log('保存的id：' + id)
    router.push(`/${id}`)
  }
  loadingInstance.close()
}
const convertParams = () => {
  return {
    userId: userId.value,
    title: title.value.trim(),
    content_md: markdownDesc.value,
    content_hm: translateDesc.value,
    description: description.value.trim(),
    imageName: imgName.value,
    image: uploadImgUrl.value,
    imageWebp: uploadWebpImgUrl.value,
    classifyId: classifyId.value,
    label: label.value,
    status: status.value,
    isLove: isLove.value
  }
}
const back = () => {
  window.history.back()
}
</script>

<template>
  <main>
    <section class="add-blog">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/">博客首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'list' }">后台中心</el-breadcrumb-item>
        <el-breadcrumb-item>博客编辑页</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form label-width="96px">
        <el-input
          v-model="title"
          type="text"
          maxlength="72"
          class="blog-title"
          placeholder="博客标题..."
          style="width: 100%"
        ></el-input>
        <mavon-editor
          ref="mdEditRef"
          v-model="markdownDesc"
          :tab-size="2"
          code-style="github"
          placeholder="编辑内容，支持 Markdown"
          class="detail-article"
          @imgAdd="addImg"
          @imgDel="delImg"
          @save="markdownSave"
        ></mavon-editor>
        <el-form-item label="博客描述：" style="padding-top: 42px">
          <el-input
            v-model="description"
            :autosize="{ minRows: 4, maxRows: 10 }"
            style="width: 460px"
            type="textarea"
            :rows="4"
            placeholder="为博客的写上简单描述吧~~"
          ></el-input>
        </el-form-item>
        <!-- upload image -->
        <edit-upload
          :id="id"
          title="封面 AVIF："
          :temp-id="tempId"
          :default-list="defaultUpload"
          :upload-img-url="uploadImgUrl"
          @changeImg="changeImg"
        ></edit-upload>
        <edit-upload
          :id="id"
          title="封面 WebP："
          :temp-id="tempId"
          :default-list="defaultUploadWebp"
          :upload-img-url="uploadWebpImgUrl"
          :is-backup="true"
          @changeImg="changeWebpImg"
        ></edit-upload>
        <el-form-item label="分类存档：">
          <el-radio-group v-model="classifyId">
            <el-radio
              v-for="(item, index) in classifyList"
              :key="index"
              :label="item.id"
            >
              <span>{{ item.name }}</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="个性标签：">
          <el-input
            v-model="label"
            placeholder="为博客添加标签吧~~ 英文逗号 , 分割"
            :maxlength="60"
            style="width: 460px"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否爱情：">
          <el-switch v-model="isLove" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="是否发布：">
          <el-switch v-model="statusFlag"> </el-switch>
        </el-form-item>
      </el-form>
      <div class="blog-btn">
        <el-button type="primary" size="large" @click="beforeCommit"
          >保存</el-button
        >
        <el-button style="margin-left: 50px" size="large" @click="back"
          >返回</el-button
        >
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
section {
  padding: 40px 50px 30px;
  animation: fadeIn 0.6s linear;

  .el-breadcrumb {
    padding-bottom: 26px;
  }

  .blog-btn {
    text-align: center;

    button {
      width: 160px;
    }
  }
}

section :deep() {
  .el-breadcrumb__inner a:hover,
  .el-breadcrumb__inner.is-link:hover {
    color: #eb5055;
    cursor: url(../../assets/pic/cursor.cur), pointer !important;
  }

  .blog-title {
    input {
      height: 40px;
      font-size: 14px;
      color: #666;
      text-align: center;
      border: none;
      border-top: 1px solid #ddd;
      outline: none;

      &:hover {
        border-color: #ddd !important;
      }

      &:focus {
        border-color: #ddd !important;
        box-shadow: none !important;
      }
    }
  }

  .el-switch__core,
  .el-radio,
  .el-radio__input,
  .el-radio__inner {
    cursor: url(../../assets/pic/cursor.cur), pointer !important;
  }

  .el-input__inner {
    line-height: 1.5;
  }

  .content-input-wrapper {
    height: 100%;
    padding: 15px 0 !important;

    .auto-textarea-wrapper .auto-textarea-input {
      padding: 0 25px;
    }
  }
}
</style>
