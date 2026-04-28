import request from '@/utils/request'

export function getTableMergeList(data: any) {
  return request({
    url: '/v1/shop/table_merge_list/',
    method: 'post',
    data,
  })
}

export function getTableMergeDetail(id: number | string) {
  return request({
    url: `/v1/shop/table_merge/${id}/`,
    method: 'get',
  })
}

export function separateTableMerge(id: number | string, data: any) {
  return request({
    url: `/v1/shop/table_merge/${id}/`,
    method: 'post',
    data,
  })
}
