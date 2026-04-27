import request from '@/utils/request'

export function getCaptainAuditList(data: any) {
  return request({
    url: '/v1/shop/captain_profile/audit_list/',
    method: 'post',
    data,
  })
}

export function auditCaptain(data: any) {
  return request({
    url: '/v1/shop/captain_profile/audit/',
    method: 'post',
    data,
  })
}

export function getCaptainList(data: any) {
  return request({
    url: '/v1/shop/captain_profile/captain_list/',
    method: 'post',
    data,
  })
}

export function setCaptainCommissionAll(data: any) {
  return request({
    url: '/v1/shop/captain_profile/commission/set_all/',
    method: 'post',
    data,
  })
}

export function setCaptainCommissionSelected(data: any) {
  return request({
    url: '/v1/shop/captain_profile/commission/set_selected/',
    method: 'post',
    data,
  })
}

export function changeCaptainBanStatus(data: any) {
  return request({
    url: '/v1/shop/captain_profile/ban/',
    method: 'post',
    data,
  })
}

export function getCaptainMemberList(data: any) {
  return request({
    url: '/v1/shop/referral_relation/member_list/',
    method: 'post',
    data,
  })
}

export function changeReferralStatus(data: any) {
  return request({
    url: '/v1/shop/referral_relation/change_status/',
    method: 'post',
    data,
  })
}
