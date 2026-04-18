import request from '@/utils/request'

/**
 * 获取归集列表
 */
export function getClassifysList(params?: object) {
  return request({
    url: '/v2/shop/classifys/',
    method: 'get',
    params: params,
  })
}

/**
 * 获取归集详情
 */
export function getClassifysDetail(data: any) {
  return request({
    url: `/v2/shop/classifys/${data.id}/`,
    method: 'get',
    data
  })
}

/**
 * 添加归集
 */
export function addClassifys(data: object) {
  return request({
    url: '/v2/shop/classify/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新归集信息
 */
export function updateClassifys(data: any) {
  return request({
    url: `/v2/shop/classify/${data.id}/`,
    method: 'post',
    data,
    
  })
}

//删除归集
export function delClassifys(data: any) {
  return request({
    url: '/v2/shop/classify/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
