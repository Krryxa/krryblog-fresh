<script setup lang="ts">
import { ref, Ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchRef: Ref<HTMLElement | null> = ref(null)
const keyWord = ref('')
const search = () => {
  // 不需要去掉字符串中间的空格，两边的空格在 v-model.trim 已经去掉
  // this.keyWord = this.keyWord.replace(/\s*/g, '');
  if (keyWord.value !== '') {
    console.log('search api...')
    router.push({ name: 'search', params: { keyword: keyWord.value } })
    keyWord.value = ''
  }
}
const focusSearch = () => {
  searchRef.value && searchRef.value.focus()
}
</script>

<template>
  <section>
    <div class="search-box">
      <input
        ref="searchRef"
        v-model.trim="keyWord"
        type="text"
        placeholder="查找你喜欢的内容..."
        :maxlength="30"
        autocomplete="off"
        class="inp-search"
        @keyup.enter="search"
      />
      <button class="inp-btn" @click="search">Search</button>
      <div class="clear"></div>
    </div>
    <p class="msg">Sorry，没找到你想要的~~</p>
    您可以换个关键词&nbsp;
    <span class="border-line rep-search" @click="focusSearch">重新搜索</span>
    &nbsp;或&nbsp;
    <router-link to="/" class="border-line">返回首页</router-link>
  </section>
</template>

<style lang="scss" scoped>
section {
  padding: 70px 0;
  line-height: 70px;
  text-align: center;
  animation: fadeIn 0.6s linear;

  .msg {
    padding: 0 8px;
    margin-top: 30px;
    font-size: 26px;
  }

  .search-box {
    box-sizing: border-box;
    max-width: 600px;
    padding: 0 10px;
    margin: 0 auto;

    &:hover {
      .inp-btn {
        background: #f60;
        border-color: #f60;
      }

      .inp-search {
        border-color: #f60;
      }
    }

    .inp-search {
      box-sizing: border-box;
      float: left;
      width: 80%;
      height: 38px;
      padding: 4px 9px;
      margin: 0 auto;
      font-size: 14px;
      border: 1px solid #dcdee2;
      border-right: none;
      border-radius: 5px 0 0 5px;
      outline: none;
      transition: 0.3s;

      &:focus {
        border-color: #f60;
        box-shadow: 0 0 0 2px rgba(255, 118, 19, 0.2);
      }
    }

    .inp-btn {
      float: left;
      width: 20%;
      height: 38px;
      font-size: 14px;
      line-height: 38px;
      color: #fff;
      background: #ff8f44;
      border: 1px solid #ff8737;
      border-left: none;
      border-radius: 0 5px 5px 0;
      outline: none;
      transition: 0.3s;
    }
  }

  .border-line {
    border-bottom: 1px solid #ccc;
    transition: 0.3s;

    &:hover {
      color: #eb5055;
      border-bottom: 1px solid #eb5055;
    }
  }

  .rep-search {
    cursor: url(../../../../assets/pic/cursor.cur), pointer !important;
  }
}
</style>
