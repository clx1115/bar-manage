import request from '@/utils/request'

//获取积分商品分类列表
export function getCategoryList(params?: object) {
  return request({
    url: '/v2/shop/shop_category/score_product_categories/',
    method: 'get',
    params: params,
  })
}

/**
 * 获取积分商品分类详情
 */
export function getCategoryDetail(data: any) {
  return request({
    url: `/v2/shop/shop_category/score_product_categories/${data.id}/`,
    method: 'get',
    data: { categoryId:data.id},
  })
}

/**
 * 添加积分商品分类
 */
export function addCategory(data: object) {
  return request({
    url: '/v2/shop/shop_category/score_product_categories/new/',
    method: 'post',
    data,
  })
}

//修改积分商品分类信息
export function updateCategory(data: any) {
  return request({
    url: `/v2/shop/shop_category/score_product_categories/${data.id}/`,
    method: 'post',
    data,
  })
}

//删除积分商品分类
export function delCategory(data: any) {
  return request({
    url: '/v2/shop/shop_category/score_product_categories/',
    method: 'post',
    data: { categoryId: data.id, operation: 'del' },
  })
}