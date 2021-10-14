import { getBlog, getBlogByTag } from '@/service/api'

export const configMap: any = {
  home: {
    api: getBlog
  },
  homePage: {
    api: getBlog
  },
  tag: {
    pageSize: 9,
    api: getBlogByTag,
    header: {
      description: '相关内容 —— 标签'
    },
    paramMap: {
      tag: 'name'
    }
  }
}
