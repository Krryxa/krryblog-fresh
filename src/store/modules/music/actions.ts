import * as Types from './mutations-type'

export default {
  // 设置当前播放歌曲信息
  async [Types.SETMUSIC]({ commit }: any, music: any) {
    commit(Types.SETMUSIC, music)
  }
}
