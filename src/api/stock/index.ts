import request from '@/utils/request'

//获取商品库存列表
export function getStockList(data: any) {
  return request({
    url: '/v2/shop/pos/ware_left_stock_list/',
    method: 'post',
    data,
  })
}

//获取商品库存日志
export function getStockLogList(data: object) {
  return request({
    url: '/v2/shop/pos/stock_log_list/',
    method: 'post',
    data,
  })
}
