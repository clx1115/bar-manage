import request from '@/utils/request'

/**
 * 获取用户列表
 */
export function getMemberList(data: object) {
  return request({
    url: '/v2/shop/members/',
    method: 'post',
    data,
  })
}

/**
 * 获取用户详情
 */
export function getMemberDetail(data: any) {
  return request({
    url: `/v2/shop/members/${data.id}/`,
    method: 'get',
    params: {},
  })
}

//锁定/解锁用户
export function setMemberStatus(data: any) {
  return request({
    url: '/v2/shop/members/status/',
    method: 'post',
    data,
  })
}

//获得用户流水记录
export function getMemberBalance(data: any) {
  return request({
    url: '/v2/shop/members/status/',
    method: 'post',
    data,
  })
}
//获得用户订单
export function getMemberOrder(data: any) {
  return request({
    url: '/v2/shop/customer_orders/',
    method: 'get',
    data,
  })
}
//修改用户详情
export function updateMember(data: any) {
  return request({
    url: `/v2/shop/members/${data.id}/`,
    method: 'post',
    data,
  })
}
//充值/扣款
export function updateBalance(data: any) {
  return request({
    url: '/v2/shop/member_balance/',
    method: 'post',
    data,
  })
}

// 添加会员等级
export function addMemberLevel(data: any) {
  return request({
    url: '/v2/shop/member_level/new/',
    method: 'post',
    data,
  })
}

// 用户等级列表
export function getLevelList(data: any) {
  return request({
    url: '/v2/shop/member_level_list/',
    method: 'get',
    data,
  })
}

// 更新用户等级配置
export function updataMemberLevel(data: any) {
  return request({
    url: `/v2/shop/member_level/${data.id}/`,
    method: 'post',
    data,
  })
}

// 用户等级配置 详情
export function getMemberLevel(data: any) {
  return request({
    url: `/v2/shop/member_level/${data.id}/`,
    method: 'get',
    data,
  })
}

// 删除用户等级配置
export function delMemberLevel(data: any) {
  return request({
    url: `/v2/shop/member_level/`,
    method: 'post',
    data,
  })
}


//获取业务员客户记录
export function getDealerCustomersList(data: any) {
  return request({
    url: '/v2/shop/dealer_customers/',
    method: 'post',
    data,
  })
}

//获取业务员客户订单列表
export function getDealerCustomersOrder(data: any) {
  return request({
    url: '/v2/shop/customer_orders/',
    method: 'get',
    params: data,
  })
}


//生成用户宣传二维码
export function generateBarcode(data: any) {
  return request({
    url: '/v2/shop/member_barcode/',
    method: 'get',
    params: data,
  })
}


//寄存列表
export function getPlaceList(data: any) {
  return request({
    url: '/v2/shop/pos/storage_list/',
    method: 'post',
    data
  })
}

//寄存明细
export function getPlaceLogList(data: any) {
  return request({
    url: '/v2/shop/pos/storage_log_list/',
    method: 'post',
    data,
  })
}