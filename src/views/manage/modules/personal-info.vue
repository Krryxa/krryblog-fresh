<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { updateUser } from '@/service/api'
import { ElLoading, ElMessage } from 'element-plus'
import { PERSON_MODIFY_RULE } from '@/views/service/rules/index'
import Cookies from 'js-cookie'
const props = defineProps(['showModel'])
const emit = defineEmits(['closeDialog'])

const store = useStore()
const showPW = ref(false)
const userForm = ref({
  newName: '',
  originPW: '',
  newPW: '',
  reNewPW: ''
})

const dialogVisible = ref(false)
watch(
  () => props.showModel,
  (val: boolean) => (dialogVisible.value = val)
)
const userId = computed(() => Cookies.get('id'))
const showPWmsg = computed(() =>
  showPW.value ? 'Pick up, No modify password' : 'Modify password'
)

let loadingInstance = null

const userFormRef: any = ref(null)
// 确认修改个人信息
const confirmUser = () => {
  userFormRef.value &&
    userFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        loadingInstance = ElLoading.service({
          lock: true,
          text: 'Modifying~~'
        })
        let reqData = {
          id: +userId.value,
          name: userForm.value['newName']
        }
        if (showPW.value) {
          // 如果修改密码
          reqData = Object.assign({}, reqData, {
            originWord: userForm.value['originPW'],
            password: userForm.value['newPW']
          })
        }
        let res: any = await updateUser(reqData.id, reqData)
        loadingInstance.close()
        if (res !== 'success') {
          ElMessage.error(res)
        } else {
          ElMessage.success('Modified success!')
          cancel()
        }
      }
    })
}
const cancel = () => {
  emit('closeDialog')
  userFormRef.value && userFormRef.value.resetFields()
  showPW.value = false
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="400px"
    title="Modifying personal information"
    :before-close="cancel"
    :show-close="false"
  >
    <el-form
      ref="userFormRef"
      :model="userForm"
      :rules="PERSON_MODIFY_RULE(userForm)"
      label-position="top"
      class="user-form"
    >
      <el-form-item label="User Name" prop="newName">
        <el-input
          v-model="userForm.newName"
          autocomplete="off"
          :maxlength="10"
          width="100"
          placeholder="Please enter your name..."
        ></el-input>
      </el-form-item>
      <p class="text-right">
        <a href="javascript:void(0)" @click="showPW = !showPW">{{
          showPWmsg
        }}</a>
      </p>
      <template v-if="showPW">
        <el-form-item label="Original Password" prop="originPW">
          <el-input
            v-model="userForm.originPW"
            type="password"
            autocomplete="off"
            :maxlength="20"
            placeholder="Please enter your original password..."
          ></el-input>
        </el-form-item>
        <el-form-item label="New Password" prop="newPW">
          <el-input
            v-model="userForm.newPW"
            type="password"
            autocomplete="off"
            :maxlength="20"
            placeholder="Please enter your new password..."
          ></el-input>
        </el-form-item>
        <el-form-item label="Repeat The New Password" prop="reNewPW">
          <el-input
            v-model="userForm.reNewPW"
            type="password"
            autocomplete="off"
            :maxlength="20"
            placeholder="Please repeat enter your new password..."
          ></el-input>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button type="warning" size="large" @click="cancel">Cancel</el-button>
      <el-button type="primary" size="large" @click="confirmUser"
        >Confirm</el-button
      >
    </template>
  </el-dialog>
</template>

<style lang="scss">
.list {
  .el-dialog {
    border-radius: 6px !important;

    .el-form-item {
      margin-bottom: 20px;

      &__label {
        display: inline;
        font-size: 12px;
        line-height: 2;
      }

      .el-form-item__error {
        right: 0;
        left: unset;
      }
    }

    input {
      height: 32px;
      padding: 0 10px;
      line-height: 1.5;
    }

    .el-button--warning {
      background: #f90;
      border-color: #f90;

      &:hover {
        background: #ffad33;
        border-color: #ffad33;
      }
    }
  }
}

.text-right {
  font-size: 12px;
  text-align: right;
}
</style>
