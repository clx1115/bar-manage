import request from '@/utils/request'

/**
 * 获取日志列表
 */
export function getLogList(params?: object) {
  return request({
    url: '/v2/shop/operation_logs/',
    method: 'get',
    params: params,
  })
}
