import request from '@/utils/request'

//获取商品列表
export function getProductList(data: any) {
  return request({
    url: '/v2/shop/shop_product_list/',
    method: 'post',
    data,
  })
}

//上下架商品
export function setStatus(data: any) {
  return request({
    url: `/v2/shop/shop_product_status/${data.id}/`,
    method: 'post',
    data,
  })
}

//批量上下架商品
export function batchSetStatus(data: any) {
  return request({
    url: '/v2/shop/batch_update_shop_product_status/',
    method: 'post',
    data,
  })
}
