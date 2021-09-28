import actions from './actions'
import mutations from './mutations'

const state = {
  id: '',
  username: ''
}

// 计算属性
const getters = {
  id: (state: any) => state.id,
  username: (state: any) => state.username // this.$store.getters['user/classify'];
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
