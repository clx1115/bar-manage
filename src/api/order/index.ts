import request from '@/utils/request'

//普通订单列表
export function listOrders(data: object) {
  return request({
    url: '/v1/shop/orders/',
    method: 'post',
    data,
  })
}

//获取店铺订单列表
export function getOrderList(data: object) {
  return request({
    url: '/v1/shop/shop_orders/',
    method: 'post',
    data,
  })
}

//获取店铺订单详情
export function getOrderDetail(data: any) {
  return request({
    url: `/v1/shop/orders/${data.id}/`,
    method: 'get',
    params: {}
  }).catch(() => {
    return request({
      url: `/v1/shop/shop_orders/${data.id}/`,
      method: 'get',
      params: {}
    })
  })
}
//订单日志列表
export function getOrderLog(data: any) {
  return request({
    url: `/v1/shop/shop_order_logs/${data.id}/`,
    method: 'get',
    params: {}
  })
}

//订单发货
export function orderDelievered(data: any) {
  return request({
    url: `/v1/shop/order_delievered/${data.orderId}/`,
    method: 'post',
    data,
  })
}

//后台取消订单

//订单批量发货
//make order
export function makeOrder(data: any) {
  return request({
    url: '/v1/shop/make_order/',
    method: 'post',
    data,
  })
}

//finish order
export function finishOrder(data: any) {
  return request({
    url: '/v1/shop/finish_order/',
    method: 'post',
    data,
  })
}

export function batchOrderDelievered(data: any) {
  return request({
    url: '/v1/shop/batch_order_delievered/',
    method: 'post',
    data,
  })
}

//获取订单状态统计
export function getOrderCount() {
  return request({
    url: '/v1/shop/order_count/',
    method: 'get',
    params: {},
  })
}

//获取打印订单模板
export function getPrintTemplate(data: any) {
  return request({
    url: '/v1/shop/org_print_template_list/',
    method: 'post',
    data,
  })
}


//获取打印订单详情
export function getPrintTemplateDetail(data: any) {
  return request({
    url: `/v1/shop/org_print_template_list/${data.id}/`,
    method: 'get',
    params: {}
  })
}

//更新手动打印次数
export function updatePrintCount(data: any) {
  return request({
    url: `/v1/shop/order_print_count/${data.id}/`,
    method: 'post',
    data: {}
  })
}
