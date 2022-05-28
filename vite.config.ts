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
        // mitt: 'https://cdn.jsdelivr.net/npm/mitt@3.0.0/+esm',
        mitt: getLocalJsEsm(env, 'js-esm/mitt@3.0.0.js'),
        // axios: 'https://cdn.jsdelivr.net/npm/axios@0.21.4/+esm',
        axios: getLocalJsEsm(env, 'js-esm/axios@0.21.4.js'),
        // vue: 'https://cdn.jsdelivr.net/npm/vue@3.2.13/+esm',
        // 'vue-router': 'https://cdn.jsdelivr.net/npm/vue-router@4.0.11/+esm',
        // 'js-cookie': 'https://cdn.jsdelivr.net/npm/js-cookie/+esm',
        'js-cookie': getLocalJsEsm(env, 'js-esm/js-cookie.js'),
        // valine: 'https://cdn.jsdelivr.net/npm/valine@1.4.18/+esm',
        valine: getLocalJsEsm(env, 'js-esm/valine@1.4.18.js'),
        // 'headroom.js': 'https://cdn.jsdelivr.net/npm/headroom.js@0.12.0/+esm'
        'headroom.js': getLocalJsEsm(env, 'js-esm/headroom.js@0.12.0.js')
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
          target: 'http://127.0.0.1:9672',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/krryblog/, '')
        }
      }
    }
  })
}

const getLocalJsEsm = (env, url) =>
  env.VITE_PROD
    ? env.VITE_SERVER_HOST + url
    : resolve(__dirname, `public/${url}`)
