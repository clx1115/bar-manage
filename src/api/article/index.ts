import request from '@/utils/request'

//获取文章列表
export function getArticleList(params: object) {
  return request({
    url: '/v2/shop/articles/',
    method: 'get',
    params:params
  })
}

//获取文章详情
export function getArticleDetail(data: any) {
  return request({
    url: `/v2/shop/articles/${data.id}/`,
    method: 'get',
    params:{}
  })
}

//删除文章
export function delArticle(data: object) {
  return request({
    url: '/v2/shop/articles/',
    method: 'post',
    data
  })
}

//添加文章
export function addArticle(data: object) {
  return request({
    url: '/v2/shop/articles/new/',
    method: 'post',
    data
  })
}

//更新文章
export function updateArticle(data: any) {
  return request({
    url: `/v2/shop/articles/${data.id}/`,
    method: 'post',
    data
  })
}