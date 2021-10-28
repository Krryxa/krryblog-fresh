<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { ElMessageBox, ElLoading, ElMessage } from 'element-plus'
import { deleteBlogCover } from '@/service/api'
import Ax from '@/service/axios'
const props = defineProps(['id', 'uploadImgUrl', 'imgName', 'defaultList'])
const emit = defineEmits(['changeImg'])

const visible = ref(false)
const previewImg = computed(
  () => window.location.origin + '/krryblog/' + props.uploadImgUrl
)

const uploadRef: any = ref(null)

const handleView = () => {
  visible.value = true
}

let loadingInstance = null
const handleRemove = () => {
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
        uploadRef.value.uploadFiles = []
      } else {
        ElMessage.error('删除失败！')
      }
      loadingInstance.close()
    })
    .catch(() => {})
}
const handleSuccess = (res: any) => {
  if (res !== null) {
    emit('changeImg', res.oldName, res.url)
    showPercent.value = false
  }
}
const beforeAvatarUpload = (file: any) => {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
  }
  return isLt2M
}

const hide_upload = computed(() =>
  props.uploadImgUrl ? 'none' : 'inline-block'
)

const customUpload = (file: any) => {
  let FormDatas = new FormData()
  FormDatas.append('imgFile', file.file)
  Ax({
    url: '/krryblog/krry/uploadCover',
    method: 'post',
    data: FormDatas,
    // 上传进度
    onUploadProgress: (progressEvent: any) => {
      let num = ((progressEvent.loaded / progressEvent.total) * 100) | 0 // 百分比
      file.onProgress({ percent: num }) // 进度条
    }
  }).then((data: any) => {
    file.onSuccess(JSON.parse(data)) //上传成功
  })
}

const handleError = () => {
  ElMessage.error('上传失败！')
  uploadRef.value.uploadFiles = []
  showPercent.value = false
}

const uploadPercent = ref(0)
const showPercent = ref(false)
const handleProgress = (event: any) => {
  showPercent.value = true
  uploadPercent.value = event.percent
}
</script>

<template>
  <el-form-item label="封面图片：" class="upload-img">
    <el-upload
      ref="uploadRef"
      :on-success="handleSuccess"
      :auto-upload="true"
      accept="image/*"
      :before-upload="beforeAvatarUpload"
      :on-progress="handleProgress"
      :on-error="handleError"
      :file-list="defaultList"
      action="void"
      :http-request="customUpload"
      :limit="1"
      list-type="picture-card"
    >
      <template #default>
        <div class="upload-icon">
          <i class="iconfont icon-camera2"></i>
        </div>
      </template>
      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handleView()">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span class="el-upload-list__item-delete" @click="handleRemove">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </template>
    </el-upload>
    <el-progress
      v-if="showPercent"
      :stroke-width="10"
      :percentage="uploadPercent"
    />
    <el-dialog v-model="visible" title="View Image" width="680px">
      <img :src="previewImg" style="width: 100%" />
    </el-dialog>
  </el-form-item>
</template>

<style lang="scss" scoped>
.upload-img :deep() {
  position: relative;

  .el-upload--picture-card,
  .el-upload-list__item {
    width: 224px;
    height: 184px;
    margin-bottom: 0;
  }

  .upload-icon {
    height: 100%;
    line-height: 182px;
  }

  .el-dialog__header {
    padding-top: 10px;
  }

  .el-dialog__body {
    padding-top: 0;
  }

  .el-form-item__content {
    & > div:first-child:not(.el-overlay) > {
      :last-child {
        display: v-bind(hide_upload);
      }
    }
  }

  .el-upload-list--picture-card {
    display: inline-block;
    height: 184px;
  }

  .el-upload--picture-card {
    &:hover,
    &:focus {
      color: #f60;
      border-color: #f60;
    }
  }

  .el-progress {
    width: 279px;
    margin-top: 10px;
  }
}
</style>
