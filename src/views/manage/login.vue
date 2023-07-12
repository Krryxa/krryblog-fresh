<script setup lang="ts">
import { ref } from 'vue'
import { getLogin } from '@/service/api'
import { useRouter, useRoute } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
const router = useRouter()
const route = useRoute()

interface ReqDataType {
  name: string
  password: string
}

const name = ref('')
const password = ref('')

let loading: any = null
const beforeSubmit = () => {
  if (name.value.trim() === '') {
    ElMessage.warning('Please enter your username first~')
  } else if (password.value.trim() === '') {
    ElMessage.warning('Please enter your password first~')
  } else {
    loading = ElLoading.service({
      lock: true,
      text: 'Loading'
    })
    let reqData: ReqDataType = {
      name: name.value.trim(),
      password: password.value.trim()
    }
    submit(reqData)
  }
}
const submit = async (reqData: ReqDataType) => {
  let res: any = await getLogin(reqData)
  if (res.message !== 'success') {
    ElMessage.warning(res.message)
  } else {
    // 成功登录
    console.log('成功登录')
    if (route.query && route.query.returnUrl) {
      window.location.href = route.query.returnUrl as string
    } else {
      router.push({ name: 'list' })
    }
  }
  loading.close()
}
const back = () => {
  router.push('/')
}
</script>

<template>
  <section class="login">
    <h1>Login</h1>
    <el-form :label-width="73" label-position="top">
      <el-form-item label="username">
        <el-input
          v-model="name"
          placeholder="Enter name..."
          @keyup.enter="beforeSubmit"
        ></el-input>
      </el-form-item>
      <el-form-item label="password">
        <el-input
          v-model="password"
          type="password"
          placeholder="Enter password..."
          @keyup.enter="beforeSubmit"
        ></el-input>
      </el-form-item>
      <el-form-item class="my-button">
        <el-button type="primary" @click="beforeSubmit">Submit</el-button>
        <el-button style="margin-top: 18px" @click="back">Cancel</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<style lang="scss" scoped>
section {
  padding: 130px 50px 30px;
  animation: fadeIn 0.6s linear;

  h1 {
    font-size: 42px;
    color: #ff5050;
    text-align: center;
    text-shadow: 2px 2px 3px #adadad;
  }

  .el-form {
    width: 300px;
    margin: 40px auto 0;
  }
}

.login :deep(.el-form) {
  .el-form-item {
    margin-bottom: 18px;

    &__label {
      display: inline;
      line-height: 2;
    }
  }

  input {
    height: 32px;
    padding: 0 10px;
    line-height: 1.5;
  }

  .my-button {
    margin-top: 60px;

    .el-form-item__content {
      text-align: center;

      button {
        width: 100%;
        height: 32px;
        min-height: unset;
        padding: 0;
        margin-left: 0;
      }
    }
  }
}
</style>
