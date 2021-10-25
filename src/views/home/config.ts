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
    title: '$param 的搜索结果 - $documentTitle',
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
    title: '$param - $documentTitle',
    paramMap: {
      tag: 'name'
    }
  }
}
