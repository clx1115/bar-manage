import request from '@/utils/request'

/**
 * 获取收支记录列表
 */
export function getVoucherList(data?: object) {
  return request({
    url: '/v2/shop/pos/vouchers/',
    method: 'post',
    data,
  })
}

/**
 * 获取收支记录详情
 */
export function getVoucherDetail(data: any) {
  return request({
    url: `/v2/shop/pos/vouchers/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加收支记录
 */
export function addVoucher(data: object) {
  return request({
    url: '/v2/shop/pos/voucher/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新收支记录信息
 */
export function updateVoucher(data: any) {
  return request({
    url: `/v2/shop/pos/voucher/`,
    method: 'post',
    data,
  })
}

//删除收支记录
export function delVoucher(data: any) {
  return request({
    url: '/v2/shop/pos/voucher_discard/',
    method: 'post',
    data: {
      id: data.id,
    },
  })
}
