import * as Types from './mutations-type'

export default {
  // 设置用户名
  async [Types.SETUSERNAME]({ commit }: any, name: any) {
    commit(Types.SETUSERNAME, name)
  },
  // 设置用户 ID
  async [Types.SETUSERID]({ commit }: any, id: any) {
    commit(Types.SETUSERID, id)
  },
  // 清空用户信息
  async [Types.CLEARUSER]({ commit }: any) {
    commit(Types.CLEARUSER)
  }
}
