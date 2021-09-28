import * as Types from './mutations-type'

export default {
  // 设置当前播放歌曲信息
  [Types.SETMUSIC](state: any, music: any) {
    state.music = music
  }
}
