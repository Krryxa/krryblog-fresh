import Ax from '@/service/axios'
import qs from 'qs'

/**
 * 获取博客列表
 * @param {*} reqData
 */
export function getBlog(reqData: any) {
  return Ax.get('/krryblog/blog/getBlog', { params: reqData })
}

/**
 * 获取博客详情页
 * @param {*} id
 */
export function getBlogDetail(id: any) {
  return Ax.get(`/krryblog/blog/getBlogDetail/${id}`)
}

/**
 * 获取博客分类名称
 */
export function getClassify() {
  return Ax.get('/krryblog/blog/getClassify')
}

/**
 * 根据分类 id 获取博客列表
 * @param {*} id
 * @param {*} reqData
 */
export function getBlogByClassifyId(id: any, reqData: any) {
  return Ax.get(`/krryblog/blog/getBlogByClassifyId/${id}`, {
    params: reqData
  })
}

/**
 * 添加博客
 * @param {*} reqData
 */
export function addBlog(reqData: any) {
  return Ax.post('/krryblog/krry/addBlog', qs.stringify(reqData))
}

/**
 * 修改博客
 * @param {*} reqData
 */
export function updateBlog(reqData: any) {
  return Ax.post('/krryblog/krry/updateBlog', qs.stringify(reqData))
}

/**
 * 修改博客，不改变 updateTime
 * @param {*} reqData
 */
export function updateBlogNoTime(reqData: any) {
  return Ax.post('/krryblog/blog/updateBlogNoTime', qs.stringify(reqData))
}

/**
 * 增加评论数 +1
 * @param {*} id
 */
export function addBlogComment(id: any) {
  return Ax.post(`/krryblog/blog/addBlogComment/${id}`)
}

/**
 * 删除博客封面
 * @param {*} id
 * @param {*} reqData
 */
export function deleteBlogCover(id: any, reqData: any) {
  return Ax.post(`/krryblog/krry/deleteBlogCover/${id}`, qs.stringify(reqData))
}

/**
 * 获取《相关链接》或《关于》博客
 * @param {*} reqData
 */
export function getLinkOrAbout(reqData: any) {
  return Ax.get('/krryblog/part/getLinkOrAbout', { params: reqData })
}

/**
 * 获取编辑博客时的详情页（包含 markdown 字段）
 * @param {*} id
 */
export function getEditBlogDetail(id: any) {
  return Ax.get(`/krryblog/krry/getBlogDetail/${id}`)
}

/**
 * 根据博客标签获取博客列表
 * @param {*} reqData
 */
export function getBlogByTag(reqData: any) {
  return Ax.get(`/krryblog/part/getBlogByTag`, { params: reqData })
}

/**
 * 根据关键词搜索获取博客列表
 * @param {*} reqData
 */
export function getBlogByKeyword(reqData: any) {
  return Ax.get(`/krryblog/part/getBlogBykeyword`, { params: reqData })
}

/**
 * 登录
 * @param {*} reqData
 */
export function getLogin(reqData: any) {
  return Ax.post(`/krryblog/part/login`, qs.stringify(reqData))
}

/**
 * 注销登录
 * @param {*}
 */
export function getLogout() {
  return Ax.get(`/krryblog/part/logout`)
}

/**
 * 获取博客总数
 * @param {*} reqData
 */
export function getBlogCount() {
  return Ax.get(`/krryblog/krry/getBlogCount`, {})
}

/**
 * 修改用户信息
 * @param {*} reqData
 */
export function updateUser(reqData: any) {
  return Ax.post(`/krryblog/krry/updateUser`, qs.stringify(reqData))
}

/**
 * 分页获取所有博客
 * @param {*} reqData
 */
export function getAllBlogByPage(reqData: any) {
  return Ax.get(`/krryblog/krry/getBlog`, { params: reqData })
}

/**
 * 获取所有音乐
 * @param {*} reqData
 */
export function getMuisc(reqData: any) {
  return Ax.get(`/krryblog/part/getMusic`, { params: reqData })
}

/**
 * 删除音乐
 * @param {*} id
 * @param {*} reqData
 */
export function deleteMusic(id: any, reqData: any) {
  return Ax.post(`/krryblog/krry/deleteMusic/${id}`, qs.stringify(reqData))
}

/**
 * markdown 内容上传图片
 * @param {*} id
 * @param {*} reqData
 */
export function uploadContent(id: any, reqData: any) {
  return Ax.post(`/krryblog/krry/uploadContent/${id}`, reqData)
}

/**
 * 删除文件
 * @param {*} reqData
 */
export function deleteFile(reqData: any) {
  return Ax.post('/krryblog/krry/deleteFile', qs.stringify(reqData))
}

/**
 * 获取所有博客
 * @param {*} reqData
 */
export function getAllBlog(reqData: any) {
  return Ax.get(`/krryblog/blog/getAllBlog`, {
    params: reqData
  })
}

/**
 * 获取更新历程
 * @param {*} reqData
 */
export function getReviseList() {
  return Ax.get(`/krryblog/blog/getReviseList`)
}

/**
 * 获取汇总数据
 * @param {*} reqData
 */
export function getSummarizedData() {
  return Ax.get(`/krryblog/blog/getSummarizedData`)
}
