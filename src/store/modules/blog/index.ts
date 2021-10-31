import actions from './actions'
import mutations from './mutations'

const state = {
  classifyList: [],
  allLoading: false
}

// 计算属性
const getters = {
  classify: (state: any) => state.classifyList // this.$store.getters['blog/classify'];
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
