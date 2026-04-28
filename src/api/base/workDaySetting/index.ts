import request from '@/utils/request'

/**
 * 获取考勤天数列表
 */
export function getWorkDaySettingList(params?: object) {
  return request({
    url: '/v1/shop/staff_month_work_day_list/',
    method: 'get',
    params: params,
  })
}

/**
 * 获取考勤天数详情
 */
export function getWorkDaySettingDetail(data: any) {
  return request({
    url: `/v1/shop/staff_month_work_day/${data.id}/`,
    method: 'get',
    data
  })
}

/**
 * 添加考勤天数
 */
export function addWorkDaySetting(data: object) {
  return request({
    url: '/v1/shop/staff_month_work_day/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新考勤天数信息
 */
export function updateWorkDaySetting(data: any) {
  return request({
    url: `/v1/shop/staff_month_work_day/${data.id}/`,
    method: 'post',
    data,

  })
}

//删除考勤天数
export function delWorkDaySetting(data: any) {
  return request({
    url: '/v1/shop/staff_month_work_day/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
