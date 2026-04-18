import request from '@/utils/request'

/**
 * 获取员工工资基础配置列表
 */
export function getStaffSalaryList(data: object) {
  return request({
    url: '/v2/shop/staff_salary_list/',
    method: 'post',
    data,
  })
}

/**
 * 获取员工工资基础配置详情
 */
export function getStaffSalaryDetail(data: any) {
  return request({
    url: `/v2/shop/staff_salary/${data.id}/`,
    method: 'get',
    data
  })
}

/**
 * 添加员工工资基础配置
 */
export function addStaffSalary(data: object) {
  return request({
    url: '/v2/shop/staff_salary/new/',
    method: 'post',
    data,
  })
}

/**
 * 更新员工工资基础配置
 */
export function updateStaffSalary(data: any) {
  return request({
    url: `/v2/shop/staff_salary/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除员工工资基础配置
export function delStaffSalary(data: any) {
  return request({
    url: '/v2/shop/staff_salary/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}


/**
 * 生成员工工资
 */
export function generateSalary(data?: any) {
  return request({
    url: `/v2/shop/batch_staff_month_salary/`,
    method: 'post',
    data,
  })
}


/**
 * 获取工资列表
 */
export function getSalaryList(data: any) {
  return request({
    url: '/v2/shop/staff_month_salary_list/',
    method: 'post',
    data,
  })
}


/**
 * 获取员工工资详情
 */
export function getSalaryDetail(data: any) {
  return request({
    url: `/v2/shop/staff_month_salary/${data.id}/`,
    method: 'get',
    data
  })
}


/**
 * 更新员工工资详情
 */
export function updateSalary(data: any) {
  return request({
    url: `/v2/shop/staff_month_salary/${data.id}/`,
    method: 'post',
    data
  })
}

//删除员工工资
export function delSalary(data: any) {
  return request({
    url: '/v2/shop/staff_month_salary/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
