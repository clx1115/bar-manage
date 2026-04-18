import request from '@/utils/request'

/**
 * 获取分类列表
 */
export function getCategroyList(params?: object) {
  return request({
    url: '/v2/shop/articles_category_list/',
    method: 'get',
    params: params,
  })
}

/**
 * 获取分类详情
 */
export function getCategroyDetail(data: any) {
  return request({
    url: `/v2/shop/articles_category/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加分类
 */
export function addCategroy(data: object) {
  return request({
    url: '/v2/shop/articles_category/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新分类信息
 */
export function updateCategroy(data: any) {
  return request({
    url: `/v2/shop/articles_category/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除分类
export function delCategroy(data: any) {
  return request({
    url: '/v2/shop/articles_category/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
