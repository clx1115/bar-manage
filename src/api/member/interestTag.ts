import request from '@/utils/request'

export function getInterestTagList(data: any) {
  return request({
    url: '/v1/shop/interest_tag_list/',
    method: 'post',
    data,
  })
}

export function getInterestTag(id: number | string) {
  return request({
    url: `/v1/shop/interest_tag/${id}/`,
    method: 'get',
  })
}

export function addInterestTag(data: any) {
  return request({
    url: '/v1/shop/interest_tag/new/',
    method: 'post',
    data,
  })
}

export function updateInterestTag(id: number | string, data: any) {
  return request({
    url: `/v1/shop/interest_tag/${id}/`,
    method: 'post',
    data,
  })
}

export function deleteInterestTag(data: { id: number | string; operation: 'del' }) {
  return request({
    url: '/v1/shop/interest_tag/',
    method: 'post',
    data,
  })
}
