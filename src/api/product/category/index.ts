import request from '@/utils/request'

/**
 * 15 01商品分类列表
 */
export function getCategroyList(params?: object) {
  return request({
    url: '/v1/shop/product_categories/',
    method: 'get',
    params: params,
  })
}

/**
 * 16 02商品分类详情
 */
export function getCategroyDetail(data: any) {
  return request({
    url: `/v1/shop/product_categories/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 17 03添加店铺商品分类
 */
export function addCategroy(data: object) {
  return request({
    url: '/v1/shop/product_categories/new/',
    method: 'post',
    data,
  })
}

/**
 * 18 04修改店铺商品分类
 */
export function updateCategroy(data: any) {
  return request({
    url: `/v1/shop/product_categories/${data.id}/`,
    method: 'post',
    data,
  })
}

// 19 05删除店铺商品分类
export function delCategroy(data: any) {
  return request({
    url: '/v1/shop/product_categories/',
    method: 'post',
    data: {
      categoryId: data.id,
      operation: 'del',
    },
  })
}
