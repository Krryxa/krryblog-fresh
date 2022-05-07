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
      title: {
        param: 'id', // 从路由 id 匹配映射
        map: {
          1: '知识总结',
          2: '代码分享',
          3: '算法｜模式',
          4: '生活之谈'
        }
      },
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
      title: {
        name: '双 K 之恋'
      },
      description: 'Love'
    },
    title: '$param - $documentTitle'
  }
}
