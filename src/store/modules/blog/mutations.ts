import * as Types from './mutations-type'

export default {
  // 设置博客分类
  [Types.SETCLASSIFY](state: any, classifyList: any) {
    state.classifyList = classifyList
  }
}
