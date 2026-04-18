import request from '@/utils/request'

/**
 * 获取活动列表
 */
export function getActivityList(data: object) {
  return request({
    url: '/v2/shop/activity/',
    method: 'post',
    data,
  })
}

/**
 * 获取活动详情
 */
export function getActivityDetail(data: any) {
  return request({
    url: `/v2/shop/activity/${data.id}/`,
    method: 'get',
    data
  })
}

/**
 * 添加活动
 */
export function addActivity(data: object) {
  return request({
    url: '/v2/shop/activity/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新活动信息
 */
export function updateActivity(data: any) {
  return request({
    url: `/v2/shop/activity/${data.id}/`,
    method: 'post',
    data,
    
  })
}

//删除活动
export function delActivity(data: any) {
  return request({
    url: '/v2/shop/activity/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
