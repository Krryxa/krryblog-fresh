<template>
  <main>
    <section>
      <p class="number">404</p>
      <p>很抱歉，找不到页面~~</p>
      <router-link to="/">
        <el-button type="danger">返回首页</el-button>
      </router-link>
    </section>
  </main>
</template>

<style lang="scss" scoped>
section {
  padding: 170px 0;
  margin: 0 auto;
  text-align: center;
  animation: fadeIn 0.6s linear;

  .number {
    font-size: 98px;
    font-weight: 700;
    line-height: 150px;
    color: #252932;
    text-shadow: rgb(61 61 61 / 30%) 1px 1px, rgb(61 61 61 / 20%) 2px 2px,
      rgb(61 61 61 / 30%) 3px 3px;
  }

  p {
    font-size: 30px;
  }

  button {
    margin-top: 32px;
    font-size: 14px;
  }
}
</style>
