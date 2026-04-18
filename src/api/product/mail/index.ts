import request from '@/utils/request'

/**
 * 获取运费列表
 */
export function getMailList(params?: object) {
  return request({
    url: '/v2/shop/shop_mail/mail_fee_list/',
    method: 'get',
    params: params,
  })
}


/**
 * 添加运费
 */
export function addMail(data: object) {
  return request({
    url: '/v2/shop/shop_mail/mail_fee/new/',
    method: 'post',
    data
  })
}

/**
 * 更新运费信息
 */
export function updateMail(data: any) {
  return request({
    url: `/v2/shop/shop_mail/mail_fee/${data.id}/`,
    method: 'post',
    data
  })
}

//删除运费
export function delMail(data: any) {
  return request({
    url: '/v2/shop/shop_mail/mail_fee/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del'
    }
  })
}

//运费详情
export function getMailDetail(params?: object) {
  return request({
    url: '/v2/shop/shop_mail/mail_fee_list/',
    method: 'get',
    params: params,
  })
}