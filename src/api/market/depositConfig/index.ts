import request from '@/utils/request'

//获取充值配置列表
export function getDepositConfigList(params: any) {
  return request({
    url: '/v2/shop/deposit_config_list/',
    method: 'get',
    params: params,
  })
}

// 充值配置详情
export function getDepositConfigDetail(data: any) {
  return request({
    url: `/v2/shop/deposit_config/${data.id}/`,
    method: 'get',
    data,
  })
}

//添加充值配置
export function addDepositConfig(data: object) {
  return request({
    url: '/v2/shop/deposit_config/new/',
    method: 'post',
    data,
  })
}

//修改充值配置
export function updateDepositConfig(data: any) {
  return request({
    url: `/v2/shop/deposit_config/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除充值配置
export function delDepositConfig(data: any) {
  return request({
    url: '/v2/shop/deposit_config/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
