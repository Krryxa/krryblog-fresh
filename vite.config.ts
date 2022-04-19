import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import ElementPlus from 'unplugin-element-plus/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default ({ mode }) => {
  // 在其他地方可通过 import.meta.env.xxx 获取环境变量
  const env = loadEnv(mode, process.cwd()) // 获取 .env 文件里定义的环境变量
  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [
      vue(),
      // 自动按需导入样式
      ElementPlus({
        useSource: true
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        mitt: 'https://cdn.jsdelivr.net/npm/mitt@3.0.0/+esm',
        axios: 'https://esm.sh/axios@0.21.4',
        // vue: 'https://esm.sh/vue@3.2.13',
        // 'vue-router': 'https://esm.sh/vue-router@4.0.11',
        'js-cookie': 'https://cdn.jsdelivr.net/npm/js-cookie/+esm',
        valine: 'https://esm.sh/valine@1.4.16',
        'headroom.js': 'https://esm.sh/headroom.js@0.12.0'
      }
    },
    base: env.VITE_APP_BASE_URL, // 静态资源在 egg 访问的路径前缀
    build: {
      // 指定打包路径。其中 index.html 需要移动到 view 目录下，通过 build.sh 操作
      outDir: '../krryblog-egg/app/public'
    },
    server: {
      open: true,
      proxy: {
        '/krryblog': {
          target: 'http://127.0.0.1:7002',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/krryblog/, '')
        }
      }
    }
  })
}
