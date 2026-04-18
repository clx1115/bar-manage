import request from '@/utils/request'

//获取店铺列表
export function getShopList(data: any) {
  return request({
    url: '/v2/shop/shops/',
    method: 'post',
    data,
  })
}

//获取店铺详情
export function getShopDetail(data: any) {
  return request({
    url: `/v2/shop/shop/${data.id}/`,
    method: 'get',
    params: {},
  })
}

//添加店铺
export function addShop(data: object) {
  return request({
    url: '/v2/shop/shop/new/',
    method: 'post',
    data,
  })
}

//更新店铺
export function updateShop(data: any) {
  return request({
    url: `/v2/shop/shop/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除店铺
export function deleteShop(data: any) {
  return request({
    url: '/v2/shop/shop/',
    method: 'post',
    data: { id: data.id, operation: 'del' },
  })
}


//生成auth token
export function generateAuth(data: any) {
  return request({
    url: '/v2/shop/auth_sec/',
    method: 'post',
    data,
  })
}