import { createStore } from 'vuex'

import blog from './modules/blog'
import music from './modules/music'

// Vue.use(Vuex);

export default createStore({
  modules: {
    blog,
    music
  },
  strict: true // 严格模式，只能通过 mutation 来更改状态
})
