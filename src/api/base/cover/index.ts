import request from '@/utils/request'

/**
 * 获取活动外框列表
 */
export function getCoverList(params?: object) {
  return request({
    url: '/v2/shop/cover_frame_list/',
    method: 'get',
    params: params,
  })
}

/**
 * 添加活动外框
 */
export function addCover(data: any) {
  return request({
    url: '/v2/shop/cover_frame/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新活动外框
 */
export function updateCover(data: any) {
  return request({
    url: `/v2/shop/cover_frame/${data.id}/`,
    method: 'post',
    data,
  })
}

/**
 * 删除活动外框
 */
export function delCover(data: any) {
  return request({
    url: '/v2/shop/cover_frame/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
