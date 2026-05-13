import request from '@/utils/request'

export function getGamePropList(data: any) {
  return request({
    url: '/v1/shop/game_prop_list',
    method: 'post',
    data,
  })
}

export function getGamePropDetail(id: number | string) {
  return request({
    url: `/v1/shop/game_prop/${id}`,
    method: 'get',
  })
}

export function createGameProp(data: any) {
  return request({
    url: '/v1/shop/game_prop/new',
    method: 'post',
    data,
  })
}

export function updateGameProp(id: number | string, data: any) {
  return request({
    url: `/v1/shop/game_prop/${id}`,
    method: 'post',
    data,
  })
}

export function deleteGameProp(data: any) {
  return request({
    url: '/v1/shop/game_prop',
    method: 'post',
    data,
  })
}

export function getGamePropEffectList(data: any = {}) {
  return request({
    url: '/v1/shop/game_prop_effect_list',
    method: 'get',
    params: data,
  })
}

export function addGamePropByIds(data: any) {
  return request({
    url: '/v1/shop/game_prop/add_by_ids',
    method: 'post',
    data,
  })
}

export function getGamePropSalesStatistics(data: any) {
  return request({
    url: '/v1/shop/game_prop_sales_statistics',
    method: 'post',
    data,
  })
}
