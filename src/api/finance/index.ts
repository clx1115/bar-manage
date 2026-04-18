import request from '@/utils/request'

/**
 * 获取最近流水列表
 */
export function getBalanceLog(params:object) {
  return request({
    url: '/v2/shop/member_balance_log/',
    method: 'get',
    params:params,
  })
}

/**
 * 获取充值记录列表
 */
export function getChargeLog(data: object) {
  return request({
    url: '/v2/shop/deposit_log_list/',
    method: 'post',
    data,
  })
}

