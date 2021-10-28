<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import {
  ElMessageBox,
  ElLoading,
  ElMessage,
  ElNotification
} from 'element-plus'
import { deleteBlogCover } from '@/service/api'
const props = defineProps(['id', 'uploadImgUrl', 'imgName', 'defaultList'])
const emit = defineEmits(['changeImg'])

const uploadList = ref([])
const visible = ref(false)
const previewImg = computed(
  () => window.location.origin + '/krryblog/' + props.uploadImgUrl
)

watch(uploadList.value, (newVal) => {
  let Eleupload = document.getElementsByClassName('ivu-upload-input')[0]
  if (newVal.length === 0) {
    // 上传列表为空，设置文件上传为可用
    Eleupload.removeAttribute('disabled')
    emit('changeImg', '', '')
  } else {
    Eleupload.setAttribute('disabled', 'true')
  }
})

const uploadRef: any = ref(null)
onMounted(() => {
  uploadList.value = uploadRef.value.fileList
})

const handleView = () => {
  visible.value = true
}

let loadingInstance = null
const handleRemove = (file: any) => {
  ElMessageBox.confirm('确定要删除博客封面图片吗？', '提示', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      loadingInstance = ElLoading.service({ lock: true, text: 'Deleting~~' })
      let res: any = await deleteBlogCover(props.id, {
        filePath: props.uploadImgUrl
      })
      if (res === 'success') {
        ElMessage.success('删除成功！')
        // 清空图片区域
        emit('changeImg', '', '', true)
        const fileList = uploadRef.value.fileList
        uploadRef.value.fileList.splice(fileList.indexOf(file), 1)
      } else {
        ElMessage.error('删除失败！')
      }
      loadingInstance.close()
    })
    .catch(() => {})
}
const handleSuccess = (res: any, file: any) => {
  if (res !== null) {
    emit('changeImg', res.oldName, res.url)
    file.url = window.location.origin + '/krryblog/' + res.url
    file.name = res.oldName
    // 设置文件上传不可用
    let Eleupload = document.getElementsByClassName('ivu-upload-input')[0]
    Eleupload.setAttribute('disabled', 'true')
  }
}
const handleFormatError = (file: any) => {
  ElNotification.warning({
    title: 'The file format is incorrect',
    message:
      'File format of ' + file.name + ' is incorrect, please select jpg or png.'
  })
}
const handleMaxSize = (file: any) => {
  ElNotification.warning({
    title: 'Exceeding file size limit',
    message: 'File  ' + file.name + ' is too large, no more than 2M.'
  })
}
</script>

<template>
  <el-form-item label="封面图片：" class="upload-img">
    <el-upload
      ref="uploadRef"
      :on-success="handleSuccess"
      :format="['jpg', 'jpeg', 'png']"
      accept="image/*"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :default-file-list="defaultList"
      type="drag"
      name="imgFile"
      action="/krryblog/krry/uploadCover"
    >
      <div class="upload-icon">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
      <div
        v-for="(item, index) in uploadList"
        :key="index"
        class="my-upload-list"
      >
        <template v-if="item.status === 'finished'">
          <img :src="item.url" />
          <div class="my-upload-list-cover">
            <Icon type="ios-eye-outline" @click="handleView"></Icon>
            <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
          </div>
        </template>
        <template v-else>
          <!-- <Progress
            v-if="item.showProgress"
            :percent="item.percentage"
            hide-info
          ></Progress> -->
        </template>
      </div>
    </el-upload>
    <el-dialog
      v-model="visible"
      title="View Image"
      class-name="vertical-center-modal"
      width="580"
    >
      <img :src="previewImg" style="width: 100%" />
    </el-dialog>
  </el-form-item>
</template>

<style lang="scss" scoped>
.my-upload-list {
  &:hover .my-upload-list-cover {
    display: block;
  }

  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 224px;
  height: 184px;
  overflow: hidden;
  line-height: 184px;
  text-align: center;
  background: #fff;
  border-radius: 4px;

  img {
    width: 100%;
    height: 100%;
  }
}

.my-upload-list-cover {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: none;
  cursor: url(../../../assets/pic/pointer.cur), default !important;
  background: rgba(0, 0, 0, 0.6);

  i {
    margin: 0 16px;
    font-size: 28px;
    color: #fff;
    cursor: url(../../../assets/pic/cursor.cur), pointer !important;
  }
}

.ivu-upload {
  width: 224px;
  margin: 0 auto;

  .upload-icon {
    width: 224px;
    height: 184px;
    line-height: 184px;
    cursor: url(../../../assets/pic/cursor.cur), pointer !important;

    i {
      font-size: 36px !important;
    }
  }
}
</style>
<style lang="scss">
.upload-img {
  .ivu-upload-drag {
    position: relative;

    &:hover {
      border-color: #f60 !important;
    }
  }

  .ivu-upload-list {
    margin-top: 0;

    .ivu-upload-list-file > span {
      display: block;
      width: 224px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
