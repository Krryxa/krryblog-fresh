import * as Types from './mutations-type'
import { getClassify } from '@/service/api'

export default {
  // 设置博客分类
  async [Types.SETCLASSIFY]({ commit }: any) {
    let { result }: any = await getClassify()
    commit(Types.SETCLASSIFY, result.data)
  }
}
