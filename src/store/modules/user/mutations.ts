import * as Types from './mutations-type'

export default {
  // 设置用户名
  [Types.SETUSERNAME](state: any, username: any) {
    state.username = username
  },
  // 设置用户 ID
  [Types.SETUSERID](state: any, id: any) {
    state.id = id
  },
  // 清空用户信息
  [Types.CLEARUSER](state: any) {
    state.id = ''
    state.username = ''
  }
}
