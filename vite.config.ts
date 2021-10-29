import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      mitt: 'https://esm.sh/mitt@3.0.0',
      axios: 'https://esm.sh/axios@0.21.4',
      qs: 'https://esm.sh/qs@6.10.1',
      // vue: 'https://esm.sh/vue@3.2.13',
      // 'vue-router': 'https://esm.sh/vue-router@4.0.11',
      // vuex: 'https://esm.sh/vuex@4.0.2',
      valine: 'https://esm.sh/valine@1.4.16',
      // 'headroom.js': 'https://cdn.jsdelivr.net/npm/headroom.js@0.12.0/+esm',
      xss: 'https://esm.sh/xss@1.0.10'
    }
  },
  server: {
    open: true,
    proxy: {
      '/krryblog': {
        target: 'https://ainyi.com',
        changeOrigin: true
      }
    }
  }
})
