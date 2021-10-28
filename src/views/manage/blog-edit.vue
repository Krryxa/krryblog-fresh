<script setup lang="ts">
import { ref, reactive, toRefs, getCurrentInstance, computed } from 'vue'
import mavonEditor from '@/components/mavon-editor/mavon-editor.vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessageBox, ElLoading, ElMessage } from 'element-plus'
import '@/assets/css/markdown.css'
import '@/assets/css/github.css'
import {
  getEditBlogDetail,
  updateBlog,
  addBlog,
  getBlogCount,
  uploadContent,
  deleteFile
} from '@/service/api'

const route = useRoute()
const router = useRouter()
const store = useStore()
const id = ref(route.query.id || 0)
const title = ref('')
const markdownDesc = ref('')
const translateDesc = ref('')
const description = ref('')
const imgName = ref('')
const uploadImgUrl = ref('')
const classifyId = ref(1)
const label = ref('')
const blogCount: any = ref(0)
const statusFlag = ref(true)
const manualDeleteImg = ref(false)
const defaultUploadList: any = ref([])

const status = computed(() => +statusFlag.value)
// 从接口查询出分类
const classifyList = computed(() => store.getters['blog/classify'])
// 获取用户 ID
const userId = computed(() => store.getters['user/id'])

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

    imgName.value = blogObj.imageName
    uploadImgUrl.value = blogObj.image
    defaultUploadList.value = [
      {
        name: imgName,
        url: window.location.origin + '/krryblog/' + uploadImgUrl.value
      }
    ]
  }
}
const getBlogCounting = async () => {
  blogCount.value = await getBlogCount()
}

if (id.value) {
  getBlogInfo()
} else {
  // 新增查博客总数，用于 markdown 上传图片时文件夹的命名id
  getBlogCounting()
}

const { proxy }: any = getCurrentInstance()
const basePath = proxy.basePath
const mdEditRef: any = ref(null)
const addImg = async (pos: any, $file: any) => {
  let formData = new FormData()
  formData.append('imgFile', $file)
  let thisId = id.value || blogCount.value + 1
  let result: any = await uploadContent(thisId, formData)
  mdEditRef.value.$img2Url(pos, basePath + '/' + result.url)
}

let loadingInstance = null

const delImg = async (fileArr: Array<any>) => {
  loadingInstance = ElLoading.service({ lock: true, text: 'Deleting~~' })
  // fileArr: ['http://...', { name: 'xxx', ... }]
  let thisId = id.value || blogCount.value + 1
  let res: any = await deleteFile({
    filePath: `upload/content/${thisId}/${fileArr[1].name}`
  })
  if (res === 'success') {
    ElMessage.success('删除成功！')
  } else {
    ElMessage.error('删除失败！')
  }
  loadingInstance.close()
}

// markdown save
const markdownSave = (value: string, render: string) => {
  markdownDesc.value = value
  translateDesc.value = render
}

// from child
const changeImg = (name: string, url: string, isDelete: boolean) => {
  isDelete && (manualDeleteImg.value = true)
  imgName.value = name
  uploadImgUrl.value = url
}

// save and commit
const beforeCommit = () => {
  let markdownSaveBtn = document.getElementsByClassName(
    'fa-mavon-floppy-o'
  )[0] as HTMLElement
  markdownSaveBtn.click()
  if (title.value === '') {
    ElMessage.warning('先输入博客标题哦~~')
  } else if (translateDesc.value.trim() === '') {
    ElMessage.warning('先输入博客内容哦~~')
  } else if (description.value === '') {
    ElMessage.warning('先简单描述一下博客哦~~')
  } else if (uploadImgUrl.value === '') {
    ElMessage.warning('先上传封面图片哦~~')
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
    let msg: any = await updateBlog(reqData)
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
    title: title.value,
    content_md: markdownDesc.value,
    content_hm: translateDesc.value,
    description: description.value,
    imageName: imgName.value,
    image: uploadImgUrl.value,
    classifyId: classifyId.value,
    label: label.value,
    status: status.value
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
      <el-form>
        <el-input
          v-model.trim="title"
          type="text"
          maxlength="36"
          class="blog-title"
          placeholder="博客标题..."
          style="width: 100%"
        ></el-input>
        <mavon-editor
          ref="mdEditRef"
          :value="markdownDesc"
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
            v-model.trim="description"
            :autosize="{ minRows: 4, maxRows: 10 }"
            style="width: 460px"
            type="textarea"
            :rows="4"
            placeholder="为博客的写上简单描述吧~~"
          ></el-input>
        </el-form-item>
        <!-- upload image -->
        <!-- <uploadImg
          v-if="id ? uploadImgUrl || manualDeleteImg : true"
          :id="id"
          :defaultList="defaultUploadList"
          :uploadImgUrl="uploadImgUrl"
          :imgName="imgName"
          @changeImg="changeImg"
        ></uploadImg> -->
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
            v-model.trim="label"
            placeholder="为博客添加标签吧~~ 英文逗号 , 分割"
            :maxlength="60"
            style="width: 360px"
          ></el-input>
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

  .ivu-breadcrumb {
    padding-bottom: 26px;
  }

  .blog-title {
    height: 40px;
    padding: 0 10px;
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

  .v-note-wrapper {
    z-index: 1009;
  }

  .ivu-form-item {
    padding-top: 24px;
  }

  .blog-btn {
    text-align: center;

    button {
      width: 160px;
    }
  }

  .ivu-radio-wrapper {
    margin-right: 18px;
    cursor: url(../../assets/pic/cursor.cur), pointer !important;
  }
}
</style>
<style lang="scss">
.add-blog {
  .v-note-wrapper .v-note-op .v-left-item .op-icon,
  .op-icon input,
  .ivu-radio,
  .ivu-radio-input {
    cursor: url(../../assets/pic/cursor.cur), pointer !important;
  }

  .content-input-wrapper {
    padding: unset !important;

    textarea {
      padding: 8px 25px 15px 25px;
      font-size: 14px !important;
    }
  }

  .ivu-form-item {
    .ivu-form-item-label {
      font-size: 14px;
    }
  }

  .v-note-wrapper {
    .v-note-show {
      .v-show-content {
        ul li {
          list-style: initial !important;
        }
      }
    }

    .v-note-img-wrapper {
      img {
        max-width: 86%;
        max-height: 86%;
        cursor: zoom-out;
      }
    }
  }

  .ivu-upload-list-remove {
    display: none;
  }

  textarea.ivu-input {
    &:hover {
      border-color: #f60 !important;
    }

    &:focus {
      border-color: #f60 !important;
      box-shadow: 0 0 0 2px rgba(255, 118, 19, 0.2) !important;
    }
  }
}
</style>
