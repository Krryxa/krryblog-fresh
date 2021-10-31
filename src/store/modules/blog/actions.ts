import * as Types from './mutations-type'
import { getClassify } from '@/service/api'

export default {
  // 设置博客分类
  async [Types.SETCLASSIFY]({ commit }: any) {
    const { result }: any = await getClassify()
    commit(Types.SETCLASSIFY, result.data)
  },

  // 设置全局loading
  [Types.ALLLOADING]({ commit }: any, flag: boolean) {
    commit(Types.ALLLOADING, flag)
  }
}
