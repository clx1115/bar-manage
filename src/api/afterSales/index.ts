import request from '@/utils/request'

//获取售后订单列表
export function getAfterSalesList(data: object) {
  return request({
    url: '/v2/shop/return_orders_list/',
    method: 'get',
    params: data,
  })
}

//获取订单详情
export function getAfterSalesDetail(data: any) {
  return request({
    url: `/v2/shop/order_returns/${data.id}/`,
    method: 'get',
    params: {},
  })
}

// 处理退货
export function handleOrderReturn(data: any) {
  return request({
    url: '/v2/shop/handle_order_return/',
    method: 'post',
    data,
  })
}

// 驳回退款
export function rejectOrderRefund(data: any) {
  return request({
    url: '/v2/shop/reject_order_refund/',
    method: 'post',
    data,
  })
}

// 同意退款
export function handleOrderRefund(data: any) {
  return request({
    url: '/v2/shop/handle_order_refund/',
    method: 'post',
    data,
  })
}
