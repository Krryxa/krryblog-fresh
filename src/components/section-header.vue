<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="header">
    <h1>
      <span class="e-left">『</span>
      <span class="text">{{ title }}</span>
      <span class="e-right">』</span>
    </h1>
    <h4>{{ description }}</h4>
  </div>
</template>

<style lang="scss" scoped>
.header {
  padding: 96px 0 28px;
  text-align: center;
  background: url(../assets/pic/category.jpg) no-repeat;
  background-size: cover;

  h1 {
    position: relative;
    margin: 0 auto;
    margin-bottom: 10px;
    font-size: 30px;
    font-weight: 400;
    color: rgb(255 255 255 / 89%);
    text-shadow: 0 4px 8px rgb(7 17 27 / 40%);
    letter-spacing: 0.1em;

    .e-left {
      position: relative;
      top: -12px;
      left: 2px;
    }

    .e-right {
      position: relative;
      top: -10px;
      right: 2px;
    }

    .text {
      display: inline-block;
      max-width: 660px;
      margin: 0 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  h4 {
    font-size: 16px;
    font-weight: 400;
    color: rgb(255 255 255 / 54%);
  }
}
</style>
