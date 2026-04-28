import request from '@/utils/request'

/**
 * 获取用户列表
 */
export function getUserList(params?: object) {
  return request({
    url: '/v1/shop/shop_members/',
    method: 'get',
    params,
  })
}

/**
 * 添加新用户
 */
export function addUser(data: object) {
  return request({
    url: '/v1/shop/shop_members/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新用户信息
 */
export function updateUser(data: any) {
  return request({
    url: `/v1/shop/admin_member/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除用户
export function delUser(data: any) {
  return request({
    url: '/v1/shop/admin_member/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
