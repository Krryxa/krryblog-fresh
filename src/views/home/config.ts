import { getBlog, getBlogByTag, getBlogByKeyword } from '@/service/api'

export const configMap: any = {
  home: {
    api: getBlog,
    pageParamName: 'pageIndex',
    pageParamType: 'params'
  },
  homePage: {
    api: getBlog,
    pageParamName: 'pageIndex',
    pageParamType: 'params'
  },
  search: {
    pageSize: 9,
    api: getBlogByKeyword,
    pageParamName: 'page',
    pageParamType: 'query',
    header: {
      description: '相关内容 —— 搜索'
    },
    paramMap: {
      keyword: 'keyword'
    }
  },
  tag: {
    pageSize: 9,
    api: getBlogByTag,
    pageParamName: 'page',
    pageParamType: 'query',
    header: {
      description: '相关内容 —— 标签'
    },
    paramMap: {
      tag: 'name'
    }
  }
}
