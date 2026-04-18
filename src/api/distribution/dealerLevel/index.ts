import request from '@/utils/request'

/**
 * 获取分销员等级列表
 */
export function getDealerLevelList(data?: any) {
  return request({
    url: '/v2/shop/dealer_level_list/',
    method: 'get',
    params: data,
  })
}

/**
 * 获取分销员等级详情
 */
export function getDealerLevelDetail(data: any) {
  return request({
    url: `/v2/shop/dealer_level/${data.id}/`,
    method: 'get',
    params: {},
  })
}

/**
 * 添加分销员等级
 */
export function addDealerLevel(data: any) {
  return request({
    url: '/v2/shop/dealer_level/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新分销员等级
 */
export function updateDealerLevel(data: any) {
  return request({
    url: `/v2/shop/dealer_level/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除分销员等级
export function delDealerLevel(data: any) {
  return request({
    url: '/v2/shop/dealer_level/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
