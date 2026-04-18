import request from '@/utils/request'

// 07 01店铺商品列表
export function getProductList(data: any) {
  return request({
    url: '/v1/shop/product_list/',
    method: 'post',
    data,
  })
}

// 08 02店铺商品详情
export function getProductDetail(data: any) {
  return request({
    url: `/v1/shop/products/${data.id}/`,
    method: 'get',
    params: {},
  })
}

// 09 03添加店铺商品
export function addProduct(data: object) {
  return request({
    url: '/v1/shop/products/new/',
    method: 'post',
    data,
  })
}

// 10 04修改商品信息
export function updateProduct(data: any) {
  return request({
    url: `/v1/shop/products/${data.id}/`,
    method: 'post',
    data,
  })
}

// 11 05删除店铺商品
export function deleteProduct(data: any) {
  return request({
    url: '/v1/shop/products/',
    method: 'post',
    data: { list: data.id, operation: 'del' },
  })
}

// 12 06店铺上架/下架商品
export function setStatus(data: any) {
  return request({
    url: `/v1/shop/product_status/${data.id}/`,
    method: 'post',
    data,
  })
}

// 13 08批量上架/下架
export function batchSetStatus(data: any) {
  return request({
    url: '/v1/shop/batch_update_product_status/',
    method: 'post',
    data,
  })
}

/* //批量绑定商品到店铺
export function batchCloneProduct(data: any) {
  return request({
    url: '/v2/shop/batch_clone_product/',
    method: 'post',
    data,
  })
} */

// 14 09批量更新店铺商品
export function batchUpdateProduct(data: any) {
  return request({
    url: `/v1/shop/batch_update_product/`,
    method: 'post',
    data,
  })
}