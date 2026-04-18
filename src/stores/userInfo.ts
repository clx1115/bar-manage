import { defineStore } from 'pinia'
import { Session } from '@/utils/storage'
import { login, getUserInfo } from '@/api/login/index'

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
  state: (): UserInfoState => ({
    token: '',
    userInfos: {
      name: '',
      avatar: '',
      roles: [],
      authBtnList: []
    },
  }),
  actions: {
    async setUserInfos() {
      // 存储用户信息到浏览器缓存
      if (Session.get('userInfo')) {
        this.userInfos = Session.get('userInfo')
      } else {
        const userInfos: any = await this.getUserData()
        this.userInfos = userInfos
      }
    },
    async getUserData() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res: any) => {
            const userInfos = {
              name: res.realName,
              avatar: res.avatar,
              roles: [res.rules],
              authBtnList: [],
            }
            resolve(userInfos)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    async login(loginData: any) {
      console.log(loginData)
      const { username, password } = loginData // vcode removed
      return new Promise((resolve, reject) => {
        login({
          username: username.trim(),
          password: password.trim()
        })
          .then((response: any) => {
            const { token, realName, avatar, rules } = response
            Session.setString('token', token)
            const userInfos = {
              name: response.realName,
              avatar: response.avatar,
              roles: [response.rules || 'admin'],
              authBtnList: []
            }
            Session.set('userInfo', userInfos)
            this.userInfos = userInfos
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
})
