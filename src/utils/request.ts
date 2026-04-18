import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Session } from '@/utils/storage'
import md5 from 'js-md5'
import { v4 as uuidv4 } from 'uuid'
import { webSalt } from '@/config'

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 50000,
})

// 添加请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = Session.getString('token') || ''
    const t = Number(new Date(Date.parse(new Date().toString()))) / 100
    const nonce = uuidv4()
    const s = md5(token + md5(token + webSalt + t + nonce))
    config.headers!['X-Requested-With'] = '*'
    config.headers!['Csrf-Token'] = 'nocheck'
    config.headers!['X-AUTH-TOKEN-UID'] = token
    config.headers!['t'] = config.headers!['t'] || t
    config.headers!['nonce'] = config.headers!['nonce'] || nonce
    config.headers!['s'] = config.headers!['s'] || s
    console.log(config)
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    console.log(response)
    // 对响应数据做点什么
    const data = response.data
    if (data.code !== 200) {
      // `token` 过期或者账号已在别处登录
      if (data.code === 403 || data.code === -1) {
        Session.clear() // 清除浏览器全部临时缓存
        window.location.href = '/shop/' // 去登录页
        ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
      }
      ElMessage({
        message: data.reason || '系统出错',
        type: 'error',
      })
      return Promise.reject(new Error(data.reason || 'Error'))
    } else {
      return response.data
    }
  },
  (error) => {
    // 对响应错误做点什么
    if (error.message.indexOf('timeout') != -1) {
      ElMessage.error('网络超时')
    } else if (error.message == 'Network Error') {
      ElMessage.error('网络连接错误')
    }
    return Promise.reject(error)
  }
)

// 导出 axios 实例
export default service
