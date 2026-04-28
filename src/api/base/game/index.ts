import request from '@/utils/request'

export function getGameList(data: any) {
  return request({
    url: '/v1/shop/game_list/',
    method: 'post',
    data,
  })
}

export function getGameDetail(id: number | string) {
  return request({
    url: `/v1/shop/game/${id}/`,
    method: 'get',
  })
}

export function createGame(data: any) {
  return request({
    url: '/v1/shop/game/create/',
    method: 'post',
    data,
  })
}

export function updateGame(data: any) {
  return request({
    url: '/v1/shop/game/update/',
    method: 'post',
    data,
  })
}

export function deleteGame(data: { ids: Array<number | string> }) {
  return request({
    url: '/v1/shop/game/delete/',
    method: 'post',
    data,
  })
}
