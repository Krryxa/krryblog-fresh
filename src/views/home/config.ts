import {
  getBlog,
  getBlogByTag,
  getBlogByKeyword,
  getBlogByClassifyId,
  getLoveBlog
} from '@/service/api'

export const configMap: any = {
  home: {
    api: getBlog,
    pageParamName: 'pageIndex',
    pageParamType: 'params',
    defaultNum: 12
  },
  homePage: {
    api: getBlog,
    pageParamName: 'pageIndex',
    pageParamType: 'params',
    defaultNum: 12
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
  },
  category: {
    pageSize: 9,
    api: getBlogByClassifyId,
    pageParamName: 'page',
    pageParamType: 'query',
    header: {
      title: 'categoryName', // 从接口的 categoryName 字段读取
      description: '相关内容 —— 存档'
    },
    title: '$param - $documentTitle',
    paramMap: {
      id: 'id'
    }
  },
  love: {
    pageSize: 9,
    api: getLoveBlog,
    pageParamName: 'page',
    pageParamType: 'query',
    header: {
      title: 'name',
      description: 'Love'
    },
    title: '$param - $documentTitle'
  }
}
