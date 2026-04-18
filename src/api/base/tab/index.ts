import request from '@/utils/request'

/**
 * 获取TAB列表
 */
export function getTabList(params?: object) {
  return request({
    url: '/v2/shop/product_tabs/',
    method: 'get',
    params: params,
  })
}

/**
 * 获取TAB详情
 */
export function getTabDetail(data: any) {
  return request({
    url: `/v2/shop/product_tabs/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加TAB
 */
export function addTab(data: object) {
  return request({
    url: '/v2/shop/product_tab/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新TAB信息
 */
export function updateTab(data: any) {
  return request({
    url: `/v2/shop/product_tab/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除TAB
export function delTab(data: any) {
  return request({
    url: '/v2/shop/product_tab/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
