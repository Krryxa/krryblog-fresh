<script setup lang="ts">
import { ref } from 'vue'

const SERVER_HOST = ref(import.meta.env.VITE_SERVER_HOST as string)
</script>

<template>
  <footer>
    <div class="container">
      <!-- 需要用到的竖线使用全角竖线｜ -->
      <span class="footer-flot fir-desc-footer">
        <a href="http://beian.miit.gov.cn" target="_blank">粤ICP备17158733号</a>
      </span>
      <span class="footer-flot fir-footer-flot">｜</span>
      <span class="footer-flot sec-desc-footer">
        <a
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44081102000040"
          target="_blank"
          >粤公网安备44081102000040号</a
        >
      </span>
      <span class="footer-flot sec-footer-flot">｜</span>
      <p class="link-git">
        <span class="name">
          Copyright © 2018 - {{ new Date().getFullYear() }}&nbsp;
          <a target="_blank" :href="SERVER_HOST">ainyi.com</a>&nbsp;
        </span>
        <span class="github">
          <a target="_blank" href="https://github.com/Krryxa">
            <i class="iconfont icon-github" />
          </a>
        </span>
      </p>
      <el-backtop :visibility-height="800" :bottom="60" />
    </div>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  height: 120px;
  margin-top: 16px;
  background: rgb(255 255 255 / 50%);

  .container {
    position: relative;
    width: 1080px;
    max-width: 100%;
    height: 100%;
    margin: 0 auto;
    font-size: 14px;
    line-height: 26px;
    text-align: center;

    .footer-flot {
      position: relative;
      top: 50%;
      display: inline-block;
      transform: translateY(-50%);
    }

    .link-git {
      position: relative;
      top: 50%;
      display: inline-block;
      transform: translateY(-50%);

      .github {
        i {
          margin-top: -5px;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
