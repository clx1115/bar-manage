import request from '@/utils/request'

export interface ScoreRankQuery {
  count: number
}

export interface ScoreRankItem {
  rank: number
  userId: number | string
  nickName: string
  avatar: string
  phoneNumber: string
  score: number | string
}

export interface ScoreRankResponse {
  code: number
  list: ScoreRankItem[]
}

export function getWealthRank(data: ScoreRankQuery) {
  return request<any, ScoreRankResponse>({
    url: '/v1/shop/score_rank/wealth/',
    method: 'post',
    data,
  })
}

export function getCharmRank(data: ScoreRankQuery) {
  return request<any, ScoreRankResponse>({
    url: '/v1/shop/score_rank/charm/',
    method: 'post',
    data,
  })
}

export function getGameScoreRank(data: ScoreRankQuery) {
  return request<any, ScoreRankResponse>({
    url: '/v1/shop/score_rank/game/',
    method: 'post',
    data,
  })
}
