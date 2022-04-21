import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getClassify } from '@/service/api'

// composition API 写法
export const useBlogStore = defineStore('blog', () => {
  // state
  const classifyList = ref([])
  const allLoading = ref(false)

  // getters 类似计算属性，因此采用 computed
  const classify = computed(() => classifyList.value)

  // action
  const setClassify = async () => {
    const { result }: any = await getClassify()
    classifyList.value = result.data
  }
  const setAllLoading = (flag: boolean) => {
    allLoading.value = flag
  }

  return {
    classifyList,
    allLoading,
    classify,
    setClassify,
    setAllLoading
  }
})
