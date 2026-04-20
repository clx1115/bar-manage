import request from '@/utils/request'

/**
 * 兴趣标签列表
 */
export function getInterestTagList(data: any) {
  return request({
    url: '/v1/p/interest_tag_list/',
    method: 'post',
    data,
  })
}

/**
 * 兴趣标签详情
 */
export function getInterestTag(id: number | string) {
  return request({
    url: `/v1/p/interest_tag/${id}/`,
    method: 'get',
  })
}

/**
 * 添加兴趣标签
 */
export function addInterestTag(data: any) {
  return request({
    url: '/v1/p/interest_tag/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新兴趣标签
 */
export function updateInterestTag(id: number | string, data: any) {
  return request({
    url: `/v1/p/interest_tag/${id}/`,
    method: 'post',
    data,
  })
}

/**
 * 删除兴趣标签
 */
export function deleteInterestTag(data: { id: number | string, operation: 'del' }) {
  return request({
    url: '/v1/p/interest_tag/',
    method: 'post',
    data,
  })
}
