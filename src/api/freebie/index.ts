import request from '@/utils/request'

export function getFreebieConfig() {
  return request({
    url: '/v1/m/freebie_coupon_config/my_config/',
    method: 'post',
    data: {},
  })
}

export function saveFreebieConfig(data: any) {
  return request({
    url: '/v1/m/freebie_coupon_config/save/',
    method: 'post',
    data,
  })
}

export function getFreebieStatistics(data: any) {
  return request({
    url: '/v1/m/freebie_coupon_record/statistics/',
    method: 'post',
    data,
  })
}

export function getFreebieRecordList(data: any) {
  return request({
    url: '/v1/m/freebie_coupon_record/my_list/',
    method: 'post',
    data,
  })
}

export function banFreebieUser(data: any) {
  return request({
    url: '/v1/m/freebie_coupon_risk_user/ban/',
    method: 'post',
    data,
  })
}

export function unbanFreebieUser(data: any) {
  return request({
    url: '/v1/m/freebie_coupon_risk_user/unban/',
    method: 'post',
    data,
  })
}

export function getBannedFreebieUsers(data: any) {
  return request({
    url: '/v1/m/freebie_coupon_risk_user/list_banned/',
    method: 'post',
    data,
  })
}

export function checkFreebieUserBan(data: any) {
  return request({
    url: '/v1/m/freebie_coupon_risk_user/check_ban/',
    method: 'post',
    data,
  })
}

export function getFreebieUserBanRecords(data: any) {
  return request({
    url: '/v1/m/freebie_coupon_risk_user_record/by_member/',
    method: 'post',
    data,
  })
}
