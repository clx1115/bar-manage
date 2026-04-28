import request from '@/utils/request'

//获取商品统一图片
export function getProductImg() {
  return request({
    url: '/v1/shop/product_uni_image/',
    method: 'get',
    params: {},
  })
}


//保存商品统一图片
export function setProductImg(data: any) {
  return request({
    url: '/v1/shop/product_uni_image/',
    method: 'post',
    params: data,
  })
}


//店铺退货默认地址详情
export function getAddress() {
  return request({
    url: '/v1/shop/shop_return_contact_detail/',
    method: 'get',
  })
}

//店铺退货默认地址详情
export function updateAddress(data: any) {
  return request({
    url: '/v1/shop/shop_return_contact_detail/',
    method: 'post',
    data,
  })
}

//获取商家信息
export function getOrgInfo() {
  return request({
    url: '/v1/shop/org_param/',
    method: 'get',
  })
}

//更新商家信息
export function updateOrgInfo(data: any) {
  return request({
    url: '/v1/shop/org_param/',
    method: 'post',
    data,
  })
}