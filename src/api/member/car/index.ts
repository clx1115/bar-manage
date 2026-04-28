import request from '@/utils/request'

export function getCarList(data: any) {
  return request({
    url: '/v1/shop/car_list/',
    method: 'post',
    data,
  })
}

export function getCarDetail(id: number | string) {
  return request({
    url: `/v1/shop/car/${id}/`,
    method: 'get',
  })
}

export function authenticateCar(data: any) {
  return request({
    url: '/v1/shop/car/authentication/',
    method: 'post',
    data,
  })
}
