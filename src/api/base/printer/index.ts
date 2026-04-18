import request from '@/utils/request'

//获取打印机列表
export function getPrinterList(params: object) {
  return request({
    url: '/v2/shop/shop_printers/',
    method: 'get',
    params: params,
  })
}

//获取打印机详情
export function getPrinterDetail(data: any) {
  return request({
    url: `/v2/shop/shop_printers/${data.id}/`,
    method: 'get',
    params: {},
  })
}

//添加打印机
export function addPrinter(data: object) {
  return request({
    url: '/v2/shop/shop_printer/new/',
    method: 'post',
    data,
  })
}

//修改打印机
export function updatePrinter(data: any) {
  return request({
    url: `/v2/shop/shop_printer/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除打印机
export function delPrinter(data: any) {
  return request({
    url: '/v2/shop/shop_printer/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}

//绑定打印机到云端
export function bindPrinter(data: any) {
  return request({
    url: `/v2/shop/bind_shop_printer/${data.printerId}/`,
    method: 'post',
    data,
  })
}

//清空打印机订单
export function clearPrintOrder(data: object) {
  return request({
    url: '/v2/shop/clear_order_to_print/',
    method: 'post',
    data,
  })
}
