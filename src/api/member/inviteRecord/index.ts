import request from '@/utils/request'

export function getMemberInviteRecordList(data: any) {
  return request({
    url: '/v1/shop/member_invite_record_list/',
    method: 'post',
    data,
  })
}
