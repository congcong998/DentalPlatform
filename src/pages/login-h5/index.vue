<script setup lang="ts">
import { showToast } from '@uni-helper/uni-promises'
import { reactive, ref } from 'vue'
import { mLogin } from '@/api/login'
import { isDoubleTokenRes, isSingleTokenRes } from '@/api/types/login'
import { appDescription, appName } from '@/settings/index'
import { useTokenStore } from '@/store'

defineOptions({
  name: 'LoginH5',
})

definePage({
  style: {
    navigationBarTitleText: 'H5登录',
  },
})

const tokenStore = useTokenStore()
const isLoading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

async function handleLogin() {
  if (!form.username.trim()) {
    await showToast({ title: '请输入账号', icon: 'none' })
    return
  }
  if (!form.password.trim()) {
    await showToast({ title: '请输入密码', icon: 'none' })
    return
  }

  try {
    isLoading.value = true
    const res = await mLogin({
      username: form.username,
      password: form.password,
    })

    const loginData: any = (res && typeof res === 'object' && ('result' in res || 'data' in res))
      ? (res.result ?? res.data)
      : res

    let tokenValue = ''
    if (typeof loginData === 'string') {
      tokenStore.setTokenInfo({ token: loginData, expiresIn: 7200 })
      tokenValue = loginData
    }
    else if (loginData && typeof loginData === 'object') {
      if (isSingleTokenRes(loginData)) {
        tokenStore.setTokenInfo(loginData)
        tokenValue = loginData.token
      }
      else if (isDoubleTokenRes(loginData)) {
        tokenStore.setTokenInfo(loginData)
        tokenValue = loginData.accessToken
      }
      else if (typeof loginData.token === 'string') {
        tokenStore.setTokenInfo({ token: loginData.token, expiresIn: Number(loginData.expiresIn) || 7200 })
        tokenValue = loginData.token
      }
      else if (typeof loginData.accessToken === 'string' && typeof loginData.refreshToken === 'string') {
        tokenStore.setTokenInfo({
          accessToken: loginData.accessToken,
          refreshToken: loginData.refreshToken,
          accessExpiresIn: Number(loginData.accessExpiresIn) || 7200,
          refreshExpiresIn: Number(loginData.refreshExpiresIn) || 7 * 24 * 3600,
        })
        tokenValue = loginData.accessToken
      }
    }

    if (!tokenValue) {
      await showToast({ title: '登录失败，请检查账号密码', icon: 'none' })
      return
    }

    uni.setStorageSync('token', tokenValue)
    uni.switchTab({ url: '/pages/BasicInfo/index' })
  }
  catch {
    await showToast({ title: '登录失败，请稍后重试', icon: 'none' })
  }
  finally {
    isLoading.value = false
  }
}

function handleGuestEnter() {
  uni.switchTab({ url: '/pages/BasicInfo/index' })
}
</script>

<template>
  <view class="min-h-screen from-slate-50 to-slate-100 bg-gradient-to-b px-6 py-10">
    <view class="mx-auto mt-10 max-w-420px rounded-2xl bg-white p-6 shadow-sm">
      <view class="mb-6 text-center">
        <text class="block text-2xl text-slate-800 font-bold">{{ appName }}</text>
        <text class="mt-2 block text-sm text-slate-500">{{ appDescription }}</text>
      </view>

      <view class="mb-4 rounded-xl bg-slate-50 p-3">
        <text class="mb-2 block text-xs text-slate-500">账号</text>
        <input
          v-model="form.username"
          class="h-10 text-sm text-slate-800"
          placeholder="请输入账号"
          placeholder-class="text-slate-400"
        >
      </view>

      <view class="mb-5 rounded-xl bg-slate-50 p-3">
        <text class="mb-2 block text-xs text-slate-500">密码</text>
        <input
          v-model="form.password"
          password
          class="h-10 text-sm text-slate-800"
          placeholder="请输入密码"
          placeholder-class="text-slate-400"
        >
      </view>

      <button
        class="h-11 w-full rounded-xl border-none bg-emerald-600 text-sm text-white font-semibold"
        :disabled="isLoading"
        :class="isLoading ? 'opacity-70' : ''"
        @click="handleLogin"
      >
        {{ isLoading ? '登录中...' : '登录' }}
      </button>

      <view class="mt-3 text-center">
        <text class="text-xs text-slate-400">仅H5使用，微信小程序请使用原登录页</text>
      </view>

      <view class="mt-4 text-center">
        <text class="text-sm text-emerald-700" @click="handleGuestEnter">先进入基础信息页</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
button::after {
  border: none;
}
</style>
