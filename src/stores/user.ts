import { defineStore } from 'pinia'

interface UserInfo {
  id: string
  phone: string
  nickname?: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<UserInfo>({
    id: '',
    phone: '',
    nickname: '',
    avatar: '',
  })

  // 手机号登录
  async function loginByPhone(params: { encryptedData: string, iv: string, code: string }) {
    try {
      // TODO: 调用后端接口
      // const res = await request.post('/api/login/phone', params)

      // 模拟登录成功
      token.value = 'mock_token_' + Date.now()
      userInfo.value = {
        id: '1',
        phone: '138****8888',
        nickname: '用户',
        avatar: '/static/avatar-default.png',
      }

      // 持久化存储
      uni.setStorageSync('token', token.value)
      uni.setStorageSync('userInfo', userInfo.value)

      return true
    }
    catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  // 退出登录
  async function logout() {
    token.value = ''
    userInfo.value = {
      id: '',
      phone: '',
      nickname: '',
      avatar: '',
    }

    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
  }

  // 初始化用户信息
  function initUserInfo() {
    const savedToken = uni.getStorageSync('token')
    const savedUserInfo = uni.getStorageSync('userInfo')

    if (savedToken) {
      token.value = savedToken
      userInfo.value = savedUserInfo
    }
  }

  return {
    token,
    userInfo,
    loginByPhone,
    logout,
    initUserInfo,
  }
})
