import jsonp from '@/utils/jsonp'
import md5 from 'js-md5'

const key = '4ASBZ-M4OCQ-O345V-BUDX3-3NI35-X3BVO'
const sk = 'sl8gZ3DDnqmO1IDWX4tTaoUrpFgSUHWL'
const output = 'jsonp'

// 关键词输入提醒
export function keywordSearch(params: any) {
  const url = '/ws/place/v1/suggestion/'
  const keyword = params.keyword
  const callback =
    `showkeyword_${new Date().getTime()}` +
    `${Math.random().toString().replace(/\D/g, '')}`
  const sig = md5(
    `${url}?callback=${callback}&key=${key}&keyword=${keyword}&output=${output}${sk}`
  )
  return jsonp(
    'https://apis.map.qq.com/ws/place/v1/suggestion/',
    {
      key,
      keyword,
      output,
      sig,
    },
    callback
  )
}

//根据经纬度转换地址
export function getDetailByLocation(params: any) {
  console.log(params)
  const url = '/ws/geocoder/v1/'
  const location = params.location
  const callback =
    `getaddress${new Date().getTime()}` +
    `${Math.random().toString().replace(/\D/g, '')}`
  const sig = md5(
    `${url}?callback=${callback}&key=${key}&location=${location}&output=${output}${sk}`
  )
  return jsonp(
    'https://apis.map.qq.com/ws/geocoder/v1/',
    {
      key,
      location,
      output,
      sig,
    },
    callback
  )
}
