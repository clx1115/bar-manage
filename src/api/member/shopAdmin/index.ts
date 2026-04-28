import request from '@/utils/request'

export function getShopAdminList() {
  return request({
    url: '/v1/shop/shop_members/',
    method: 'post',
    data: {},
  })
}

export function getShopAdminDetail(memberId: number | string) {
  return request({
    url: `/v1/shop/shop_members/${memberId}/`,
    method: 'post',
    data: {},
  })
}

export function updateShopAdmin(data: any) {
  return request({
    url: '/v1/shop/admin_member/update',
    method: 'post',
    data,
  })
}

export function deleteShopAdmin(data: { id: number | string }) {
  return request({
    url: '/v1/shop/admin_member/delete',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}

export function updateShopAdminStatus(data: { memberId: number | string; status: number }) {
  return request({
    url: '/v1/shop/admin_member/status/',
    method: 'post',
    data,
  })
}
