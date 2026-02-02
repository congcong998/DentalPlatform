import type { IUserInfoRes } from '@/api/types/login'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getUserInfo,
} from '@/api/login'

// 初始化状态
const userInfoState: IUserInfoRes = {
  userId: -1,
  username: '',
  nickname: '',
  avatar: '/static/images/default-avatar.png',
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<IUserInfoRes>({ ...userInfoState })
    // 设置用户信息
    const setUserInfo = (val: IUserInfoRes) => {
      console.log('设置用户信息', val)
      // 若头像为空 则使用默认头像
      if (!val.avatar) {
        val.avatar = userInfoState.avatar
      }
      userInfo.value = val
    }
    const setUserAvatar = (avatar: string) => {
      userInfo.value.avatar = avatar
      console.log('设置用户头像', avatar)
      console.log('userInfo', userInfo.value)
    }
    // 删除用户信息
    const clearUserInfo = () => {
      userInfo.value = { ...userInfoState }
      uni.removeStorageSync('user')
    }

    /**
     * 获取用户信息
     */
    const fetchUserInfo = async () => {
      const res = await getUserInfo()
      setUserInfo(res)
      return res
    }

    // 添加登录方法
    async function loginByPhone(params: { encryptedData: string; iv: string; code: string }) {
      // TODO: 调用后端登录接口
      // const res = await api.loginByPhone(params)

      // 模拟登录成功
      const mockUserInfo = {
        userId: 1,
        username: 'user_' + Date.now(),
        nickname: '微信用户',
        avatar: '',
        phone: '138****8888',
      }

      setUserInfo(mockUserInfo as any)

      // 存储 token
      uni.setStorageSync('token', 'mock_token_' + Date.now())

      return mockUserInfo
    }

    return {
      userInfo,
      clearUserInfo,
      fetchUserInfo,
      setUserInfo,
      setUserAvatar,
      loginByPhone, // 添加到返回值
    }
  },
  {
    persist: true,
  },
)
