// 全局注册的组件
import myHeader from './header.vue'
import myFooter from './footer.vue'
import notFound from './not-found.vue'

interface ComponentType {
  [propName: string]: any
}

const components: ComponentType = {
  myHeader,
  myFooter,
  notFound
}
export default components
