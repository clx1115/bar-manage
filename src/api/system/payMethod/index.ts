import request from '@/utils/request'

/**
 * 获取支付方式列表
 */
export function getPayMethodList(params?: object) {
  return new Promise((resolve) => {
    request({
      url: '/v2/shop/pay_method_list/',
      method: 'get',
      params,
    }).then((data) => {
      resolve(data)
    })
  })
}

/**
 * 添加支付方式
 */
export function addPayMethod(data: object) {
  return request({
    url: '/v2/shop/pay_method/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新支付方式
 */
export function updatePayMethod(data: any) {
  return request({
    url: `/v2/shop/pay_method/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除支付方式
export function delPayMethod(data: any) {
  return request({
    url: '/v2/shop/pay_method/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}


/**
 * 同步支付方式
 */
export function clonePayMethod(data: any) {
  return request({
    url: '/v2/shop/clone_pay_method/',
    method: 'post',
    data,
  })
}