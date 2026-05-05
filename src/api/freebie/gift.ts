import request from '@/utils/request'

export function getGiftList(data: any) {
  return request({
    url: '/v1/cp/gift_list/',
    method: 'post',
    data,
  })
}

export function getGiftDetail(id: number | string) {
  return request({
    url: `/v1/p/gift/${id}/`,
    method: 'get',
  })
}

export function createGift(data: any) {
  return request({
    url: '/v1/p/gift/new/',
    method: 'post',
    data,
  })
}

export function updateGift(id: number | string, data: any) {
  return request({
    url: `/v1/p/gift/${id}/`,
    method: 'post',
    data,
  })
}

export function deleteGift(data: { operation: 'del'; ids: Array<number | string> }) {
  return request({
    url: '/v1/p/gift/',
    method: 'post',
    data,
  })
}
