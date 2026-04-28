import request from '@/utils/request'

/**
 * 01 01商户登录
 */
export function login(data: object) {
  console.log(data)
  return request({
    url: '/v1/shop/login/noauth/',
    method: 'post',
    data,
  })
}

// 02 04是否已登录
export function getIsLogin(data: object) {
  return request({
    url: '/v1/shop/is_login/',
    method: 'post',
    data,
  })
}

// 03 04商户入驻注册
export function signUp(data: object) {
  return request({
    url: '/v1/shop/user/new/',
    method: 'post',
    data,
  })
}

// 04 08查看自己详情信息
export function getUserInfo() {
  return request({
    url: '/v1/shop/admin_member/info/',
    method: 'post', // Changed to POST as per .http
  })
}

/* //登出
export function logout() {
  return request({
    url: '/v1/shop/logout/',
    method: 'post',
  })
} */

/* export function getVcode(data: object) {
  return request({
    url: '/v1/user/request_vcode/',
    method: 'post',
    data,
  })
} */

/* //获取验证码
export function getCaptcha() {
  return request({
    url: '/v1/shop/captcha/gen/noauth/',
    method: 'get',
  })
} */

/* //验证验证码
export function checkCaptcha(data: object) {
  return request({
    url: '/v1/shop/captcha/check/noauth/',
    method: 'post',
    data,
  })
} */

// 06 11设置/修改登录密码
export function updatePassword(data: object) {
  return request({
    url: '/v1/shop/set_login_password/',
    method: 'post',
    data,
  })
}

/* //获取当前登录角色菜单
export function getRoutes() {
  return new Promise((resolve) => {
    request({
      url: '/v1/shop/member_menu/',
      method: 'get',
      params: {},
    }).then((data) => {
      const list = [] as any
      data.list.forEach((item: any) => {
        const children = [] as any
        item.children = item.children ? item.children : []
        if (item.children.length) {
          item.children.forEach((child: any) => {
            children.push({
              path: child.path,
              name: child.name,
              component: child.path,
              meta: {
                title: child.title,
                isLink: '',
                isHide: child.hidden,
                isKeepAlive: child.noCache,
                isAffix: false,
                isIframe: false,
                roles: ['admin'],
                icon: 'iconfont icon-caidan',
              },
            })
          })
          list.push({
            path: item.path,
            name: item.name,
            component: 'layout/routerView/parent',
            redirect: item.path,
            children: children,
            meta: {
              title: item.title,
              isLink: '',
              isHide: item.hidden,
              isKeepAlive: item.noCache,
              isAffix: false,
              isIframe: false,
              roles: [],
              icon: item.icon,
            },
          })
        } else {
          list.push({
            path: item.path,
            name: item.name,
            component: item.path,
            meta: {
              title: item.title,
              isLink: '',
              isHide: item.hidden,
              isKeepAlive: item.noCache,
              isAffix: false,
              isIframe: false,
              roles: [],
              icon: item.icon,
            },
          })
        }
      })
      resolve(list)
    })
  })
} */
