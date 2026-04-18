import request from '@/utils/request'

/**
 * 获取提现列表
 */
export function getWithdrawList(params: object) {
  return request({
    url: '/v2/shop/withdraw_logs/',
    method: 'get',
    params,
  })
}

//审核提现
export function handleWithdraw(data: any) {
  return request({
    url: '/v2/shop/withdraw/',
    method: 'post',
    data,
  })
}
