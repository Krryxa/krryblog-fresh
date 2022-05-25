<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/store/blog'
import krryMusic from '@/components/krry-music.vue'
// import allLoading from '@/components/all-loading.vue'
import '@/util/mouseHeart'
const route = useRoute()
const blogStore = useBlogStore()
blogStore.setClassify()
const showFooter = ref(false)
const mainPageMounted = () => {
  // 因为 footer 是在页面底部，且在 App.vue 直接渲染的，所以要放在主路由文件挂载完毕后渲染，防止 footer 先行挂载，造成 CLS 偏移
  showFooter.value = true
}
</script>

<template>
  <my-header v-if="route.name !== 'edit'"></my-header>
  <krry-music></krry-music>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component
        :is="Component"
        v-if="$route.meta.keepAlive"
        @vnode-mounted="mainPageMounted"
      />
    </keep-alive>
    <component
      :is="Component"
      v-if="!$route.meta.keepAlive"
      @vnode-mounted="mainPageMounted"
    />
  </router-view>
  <!-- <all-loading></all-loading> -->
  <my-footer v-if="showFooter"></my-footer>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: #515a6e;
  -webkit-font-smoothing: antialiased;
}

html,
body {
  cursor: url(./assets/pic/pointer.cur), default;
}

a,
button:not(:disabled) {
  cursor: url(./assets/pic/cursor.cur), pointer !important;
}

a {
  color: #666;
  text-decoration: none;
  outline: 0;
  transition: color 0.2s ease;
}

a:hover {
  color: #eb5055 !important;
  transition: 0.3s;
}

ul li {
  list-style: none;
}

.right {
  float: right;
}

.left {
  float: left;
}

img {
  vertical-align: middle;
}

.clear {
  clear: both;
}

.animated {
  animation-duration: 0.5s;
}

.heart {
  animation: 0.7s heartMove ease infinite alternate;
}

@keyframes heartMove {
  50% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(90deg);
  }
}

.el-textarea__inner,
.el-input__inner {
  &:hover {
    border-color: #f60 !important;
  }

  &:focus {
    border-color: #f60 !important;
    box-shadow: 0 0 0 2px rgba(255, 118, 19, 0.2) !important;
  }
}

label {
  cursor: url(./assets/pic/pointer.cur), pointer !important;
}

/* 代码字体 */
.hljs {
  padding: 18px 15px 12px !important;
}

.hljs-name {
  font-weight: bold !important;
}

.hljs-name,
.hljs-tag {
  color: #333 !important;
}

.hljs-keyword {
  color: rgb(153, 6, 154) !important;
}

.hljs-comment,
.hljs-quote {
  font-style: normal !important;
  font-weight: bold;
}

/* 回到顶部 */
.el-backtop {
  right: unset !important;
  z-index: 1009;
  width: 40px;
  height: 40px;
  margin-left: 1020px;
  cursor: url(./assets/pic/cursor.cur), pointer !important;
  background: rgba(255, 152, 49, 0.8);
  border-radius: 50%;
  transition: 0.4s ease;

  &.el-fade-in-enter-to {
    bottom: 0 !important;
    opacity: 0;
    transform: rotate(360deg);
  }

  &.el-fade-in-leave-to {
    bottom: 0 !important;
    opacity: 0;
    transform: rotate(360deg);
  }
}

.el-backtop i {
  color: #fff;
}

.el-backtop:hover {
  background: rgba(255, 111, 27, 0.9) !important;
}

/* 加载动画 */
.icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

/* 分页样式的冲突和解决 */
.el-pagination {
  margin: 36px 0 auto;
  font-size: 14px;
  text-align: center;

  .el-pager {
    li {
      min-width: 28px;
      cursor: url(./assets/pic/cursor.cur), pointer !important;

      &:hover {
        color: #eb5055;
      }

      &.active {
        color: #eb5055;
      }
    }
  }

  .btn-prev,
  .btn-next {
    min-width: 30px;
    padding: 0 !important;
  }

  button:hover:not(:disabled) {
    color: #eb5055;
  }

  .el-pagination__jump {
    margin-left: 16px;
  }
}

/* 滚动条优化 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-track-piece {
  background: #fff;
}

::-webkit-scrollbar-thumb {
  background-color: #ff8b18;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.4) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.4) 75%,
    transparent 75%,
    transparent
  );
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

::-webkit-scrollbar-thumb:hover {
  cursor: url(./assets/pic/cursor.cur), pointer;
  background-color: #ff4f00;
}

::-webkit-scrollbar-corner {
  background: #535353;
}

::-webkit-scrollbar-resizer {
  background: #ff0bee;
}

::selection {
  color: #fff;
  background: #ff5252;
}

/* 响应式 */
@media screen and (max-width: 1080px) {
  /* 回到顶部 */
  .el-backtop {
    right: 30px !important;
  }
}

@media screen and (max-width: 967px) {
  /* 每行显示两个博客 */
  .section-article {
    width: 680px;
  }

  .section-article article {
    margin-right: 30px !important;
    margin-left: 30px !important;
  }
}

@media screen and (max-width: 780px) {
  /* 每行显示两个博客时，中间空格减小 */
  .section-article {
    width: 640px;
  }

  .section-article article {
    margin: 20px !important;
  }
}

@media screen and (max-width: 647px) {
  /* 每行显示一个博客，大小根据屏幕变化 */
  .section-article {
    width: 56%;
    min-width: 280px;
  }

  .el-pagination .el-pagination__jump {
    margin-left: 8px;
  }

  .section-article article {
    width: 100% !important;
    margin: 20px 0 !important;
  }

  /* 底部响应式 */
  footer .container .link-git {
    position: absolute !important;
    top: 40px !important;
    right: 0;
    left: 0;
    margin: auto;
  }

  footer .container .footer-flot {
    top: 64% !important;
  }

  footer .container .sec-footer-flot {
    display: none !important;
  }

  /* 汇总数据分行 */
  article .summarize ul li {
    width: 50% !important;
  }
}

@media screen and (max-width: 900px) {
  /* 目录隐藏 */
  #directory {
    display: none;
  }
}

@media screen and (max-width: 600px) {
  /* 头部菜单收起 */
  .head-page .home {
    float: none;
    text-align: center;
  }

  .head-page .nav-coll-menu {
    display: block !important;
  }

  .head-page .nav {
    position: absolute !important;
    top: 0;
    right: 6px;
    margin-left: 6px;
  }

  .head-page .nav .nav-far {
    visibility: hidden;
  }

  .head-page .nav .search i {
    top: 18px !important;
    z-index: 2 !important;
    width: 36px !important;
    height: 36px !important;
    font-size: 22px !important;
    line-height: 35px !important;
  }

  .head-page .nav .search input {
    top: 18px !important;
    z-index: 1;
    height: 34px !important;
  }
}

@media screen and (max-width: 460px) {
  /* 时间隐藏 */
  .detail-article .art-header .tag-time {
    display: none;
  }

  .detail-article .art-header .header-tag {
    width: 100% !important;
  }
}

@media screen and (max-width: 370px) {
  /* 底部响应式 */
  footer .container .fir-desc-footer {
    position: absolute !important;
    top: 54% !important;
    right: 0;
    left: 0;
  }

  footer .container .fir-footer-flot {
    display: none !important;
  }

  footer .container .sec-desc-footer {
    top: 78% !important;
  }

  footer .container .link-git {
    top: 30% !important;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
  }
}
</style>

<style lang="scss">
/* 博客详情页样式 */
.detail-article {
  .content,
  .v-show-content {
    mark {
      padding: 0.065em 0.4em;
      color: #ff502c;
      background-color: #fff5f5;
      border-radius: 6px;
    }

    p {
      font-size: 14px !important;
    }

    ul li {
      list-style: initial;
    }

    ul,
    ol {
      padding-left: 1em;

      li {
        font-size: 14px !important;
      }
    }

    h1,
    h2,
    h3 {
      position: relative;
      font-size: 1.34em;
      font-weight: 400;

      &::before {
        position: absolute;
        top: 0;
        left: -15px;
        font-size: 20px;
        font-weight: bold;
        line-height: 24px;
        color: #eb5055;
        content: '#';
      }
    }

    h1 {
      font-size: 1.4em;

      &::before {
        font-size: 21px;
        line-height: 25px;
      }
    }

    h3 {
      font-size: 1.18em;

      &::before {
        font-size: 19px;
        line-height: 21px;
      }
    }

    img {
      cursor: zoom-in;
      transition: 0.3s;
    }
  }
}
</style>
