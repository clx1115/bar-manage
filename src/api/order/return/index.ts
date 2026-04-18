import request from '@/utils/request'

//获取店铺订单详情
export function getReturnList(data: any) {
  return request({
    url: `/v2/shop/return_orders_list/`,
    method: 'get',
    data
  })
}
//处理退货
export function toReturn(data: any) {
  return request({
    url:'/v2/shop/handle_order_return/',
    method: 'post',
    data
  })
}

//处理退款
export function toRefund(data: any) {
  return request({
    url: `/v2/shop/return_orders_list/${data.id}/`,
    method: 'get',
    data
  })
}
//处理整单退款
export function toAllRefund(data: any) {
  return request({
    url:'/v2/shop/direct_order_refund/',
    method: 'post',
    data
  })
}
//驳回退款请求
export function toRejRefund(data: any) {
  return request({
    url: '/v2/shop/reject_order_refund/',
    method: 'post',
    data
  })
}
//退货详情
export function getReturnDetail(data: any) {
  return request({
    url: '/v2/shop/order_returns/',
    method: 'get',
    data
  })
}
