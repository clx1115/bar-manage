import request from '@/utils/request'

//获取首页统计数据
export function getHomeStat() {
  return request({
    url: '/v1/shop/home_page_stat/',
    method: 'get',
    params: {},
  })
}

// 订单聚合
export function orderListAgg(data: any) {
  return request({
    url: `/v1/shop/order_detail_list_agg/`,
    method: 'post',
    data,
  })
}

// 员工销售统计
export function getStaffCommissionList(data: any) {
  return request({
    url: `/v1/shop/staff_commission/`,
    method: 'get',
    params: data,
  })
}

// 日销产品统计表
export function getStaffCommissionStatList(data?: any) {
  return request({
    url: `/v1/shop/staff_commission_stat/`,
    method: 'get',
    params: data,
  })
}

// 日会员卡统计表
export function getStaffDepositStatList(data?: any) {
  return request({
    url: `/v1/shop/staff_deposit_stat/`,
    method: 'get',
    params: data,
  })
}

// 会员卡统计表
export function getMemberStatList(data?: any) {
  return request({
    url: `/v1/shop/total_member_stat/`,
    method: 'get',
    params: data,
  })
}

// 商品销售统计表
export function getProductSalesStatList(data?: any) {
  return request({
    url: `/v1/shop/total_product_sales_stat/`,
    method: 'get',
    params: data,
  })
}

// 年度总表
export function getYearStat(data?: any) {
  return request({
    url: `/v1/shop/year_stat/`,
    method: 'get',
    params: data,
  })
}