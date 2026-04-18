import request from '@/utils/request'

/**
 * 20 01列表-平台类目
 */
export function getItemList(data: any) {
  return request({
    url: '/v1/shop/item_list/',
    method: 'post',
    data,
  })
}

/**
 * 21 02详情-Item平台类目
 */
export function getItemDetail(data: any) {
  return request({
    url: `/v1/shop/item/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 22 01添加-Item平台类目
 */
export function addItem(data: object) {
  return request({
    url: '/v1/shop/item/new/',
    method: 'post',
    data,
  })
}

/**
 * 23 04更新-Item平台类目
 */
export function updateItem(data: any) {
  return request({
    url: `/v1/shop/item/${data.id}/`,
    method: 'post',
    data,
  })
}

/**
 * 24 05删除-平台类目
 */
export function deleteItem(data: any) {
  return request({
    url: '/v1/shop/item/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
