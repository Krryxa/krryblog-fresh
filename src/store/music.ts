import { ref } from 'vue'
import { defineStore } from 'pinia'

// composition API 写法
export const useMusicStore = defineStore('music', () => {
  // state
  const music: any = ref({})

  // action 设置当前播放歌曲信息
  const setMusic = (currentMusic: any) => {
    music.value = currentMusic
  }

  return {
    music,
    setMusic
  }
})
