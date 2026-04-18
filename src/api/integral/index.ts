import request from '@/utils/request'

//获取积分商品列表
export function getScoreList(data: any) {
  return request({
    url: '/v2/shop/score_product_list/',
    method: 'post',
    data,
  })
}

/**
 * 获取积分商品详情
 */
export function getScoreDetail(data: any) {
  return request({
    url: `/v2/shop/score_product/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加积分商品
 */
export function addScore(data: object) {
  return request({
    url: '/v2/shop/score_products/new/',
    method: 'post',
    data,
  })
}

//修改积分商品信息
export function updateScore(data: any) {
  return request({
    url: `/v2/shop/score_products/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除积分商品
export function delScore(data: any) {
  return request({
    url: '/v2/shop/score_products/',
    method: 'post',
    data: { list: data.id, operation: 'del' },
  })
}

//商品上下架
export function setStatus(data: any) {
  return request({
    url: `/v2/shop/score_product_status/${data.id}/`,
    method: 'post',
    data,
  })
}

//商品批量上下架
export function batchSetStatus(data: any) {
  return request({
    url: '/v2/shop/batch_update_score_product_status/',
    method: 'post',
    data,
  })
}

