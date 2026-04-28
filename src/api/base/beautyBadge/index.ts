import request from '@/utils/request'

export function getBeautyBadgeList(data: any) {
  return request({
    url: '/v1/shop/beauty_badge_list/',
    method: 'post',
    data,
  })
}

export function getBeautyBadgeDetail(id: number | string) {
  return request({
    url: `/v1/shop/beauty_badge/${id}/`,
    method: 'get',
  })
}

export function createBeautyBadge(data: any) {
  return request({
    url: '/v1/shop/beauty_badge/new/',
    method: 'post',
    data,
  })
}

export function updateBeautyBadge(id: number | string, data: any) {
  return request({
    url: `/v1/shop/beauty_badge/${id}/`,
    method: 'post',
    data,
  })
}

export function deleteBeautyBadge(data: { ids: Array<number | string> }) {
  return request({
    url: '/v1/shop/beauty_badge/delete/',
    method: 'post',
    data,
  })
}
