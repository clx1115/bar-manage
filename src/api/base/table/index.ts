import request from '@/utils/request'

export function getAreaTableList(data: any) {
  return request({
    url: '/v1/shop/area_table_list/',
    method: 'post',
    data,
  })
}

export function getAreaTableDetail(id: number | string) {
  return request({
    url: `/v1/shop/area_table/${id}/`,
    method: 'get',
  })
}

export function addAreaTable(data: any) {
  return request({
    url: '/v1/shop/area_table/new/',
    method: 'post',
    data,
  })
}

export function updateAreaTable(id: number | string, data: any) {
  return request({
    url: `/v1/shop/area_table/${id}/`,
    method: 'post',
    data,
  })
}

export function deleteAreaTable(data: { ids: Array<number | string> }) {
  return request({
    url: '/v1/shop/area_table/delete/',
    method: 'post',
    data,
  })
}
