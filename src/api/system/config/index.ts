import request from '@/utils/request'

/**
 * 获取参数配置列表
 */
export function getConfigList(params?: object) {
  return request({
    url: '/v2/shop/param_config/',
    method: 'get',
    params: params,
  })
}

/**
 * 添加参数配置
 */
export function addConfig(data: any) {
  return request({
    url: '/v2/shop/param_config/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新参数配置
 */
export function updateConfig(data: any) {
  return request({
    url: `/v2/shop/param_config/${data.id}/`,
    method: 'post',
    data,
  })
}

/**
 * 根据KEY获取参数详情
 */
export function getParameConfigByKey(data: any) {
  return request({
    url: '/v2/shop/pos/param_config/',
    method: 'get',
    params: data,
  })
}
