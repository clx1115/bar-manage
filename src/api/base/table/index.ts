import request from '@/utils/request'

//获取桌码列表
export function getTableList(data: any) {
  return request({
    url: '/v2/shop/shop_table_list/',
    method: 'get',
    params: data,
  })
}

//生成桌码
export function generateTable(data: any) {
  return request({
    url: '/v2/shop/generate_shop_table/',
    method: 'post',
    data,
  })
}

//修改桌码状态
export function modStatus(data: any) {
  return request({
    url: '/v2/shop/shop_table/' + data.id + '/',
    method: 'post',
    data,
  })
}

//删除桌码
export function delTable(data: any) {
  return request({
    url: '/v2/shop/shop_table/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}

//刷新桌码
export function refreshTable(data: any) {
  return request({
    url: '/v2/shop/refresh_table_barcode/' + data.id + '/',
    method: 'post',
    data,
  })
}
