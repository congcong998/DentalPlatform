<script setup lang="ts">
import { showToast } from '@uni-helper/uni-promises'
import { onMounted, onUnmounted, ref } from 'vue'
import { appDescription, appName } from '@/settings/index'
import { useTokenStore } from '@/store'
import { sendSmsCode, smsLogin } from '@/api/login'
import { sleep } from '@/utils'

defineOptions({
  name: 'Login',
})

const tokenStore = useTokenStore()

const statusBarHeight = ref(44)
const agreed = ref(false)
const isLoading = ref(false)
const isDev = ref(import.meta.env.DEV) // 仅开发环境显示

const phone = ref('')
const smsCode = ref('')
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '登录',
    disableScroll: true,
  },
})

onMounted(() => {
  // #ifdef H5
  uni.reLaunch({ url: '/pages/login-h5/index' })
  return
  // #endif

  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 44
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})

function startCountdown() {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
      countdownTimer = null
    }
  }, 1000)
}

async function onSendCode() {
  if (countdown.value > 0)
    return

  const phoneVal = phone.value.trim()
  if (!/^1\d{10}$/.test(phoneVal)) {
    await showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }

  try {
    await sendSmsCode(phoneVal)
    startCountdown()
    await showToast({ title: '验证码已发送', icon: 'none' })
  }
  catch {
    await showToast({ title: '发送验证码失败，请重试', icon: 'none' })
  }
}

async function onLogin() {
  if (!agreed.value) {
    await showToast({ title: '请先同意服务协议', icon: 'none' })
    return
  }

  const phoneVal = phone.value.trim()
  const codeVal = smsCode.value.trim()

  if (!/^1\d{10}$/.test(phoneVal)) {
    await showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }
  if (!/^\d{4,6}$/.test(codeVal)) {
    await showToast({ title: '请输入验证码', icon: 'none' })
    return
  }

  try {
    isLoading.value = true
    const res = await smsLogin(phoneVal, codeVal)

    // http 层已处理错误，走到这里说明登录成功
    tokenStore.setTokenInfo(res)

    await showToast({ title: '登录成功', icon: 'success' })
    await sleep(500)
    uni.switchTab({ url: '/pages/index/index' })
  }
  catch {
    await showToast({ title: '登录失败，请重试', icon: 'none' })
  }
  finally {
    isLoading.value = false
  }
}

function toggleAgreement() {
  agreed.value = !agreed.value
}

function onAgreementClick() {
  uni.navigateTo({
    url: '/pages/agreement/index',
  })
}

// 调试模式：直接跳过登录
async function onDevSkipLogin() {
  try {
    isLoading.value = true
    tokenStore.setTokenInfo({ token: 'dev-token', expiresIn: 86400 })
    uni.setStorageSync('token', 'dev-token')
    await sleep(300)
    uni.switchTab({ url: '/pages/index/index' })
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <view class="fixed inset-0 overflow-hidden bg-white">
    <!-- 顶部装饰背景 -->
    <view class="absolute left-0 right-0 top-0 h-80 overflow-hidden">
      <view class="absolute inset-0 from-blue-500 via-blue-400 to-cyan-400 bg-gradient-to-br" />
      <view class="absolute right-[-50px] top-[-30px] h-40 w-40 rounded-full bg-white/10" />
      <view class="absolute left-[-30px] top-20 h-24 w-24 rounded-full bg-white/10" />
      <view class="absolute bottom-0 left-0 right-0 h-20 rounded-t-[40px] bg-white" />
    </view>

    <!-- 状态栏占位 -->
    <view :style="{ height: `${statusBarHeight}px` }" />

    <!-- 主内容区 - 使用绝对定位避免滚动 -->
    <view class="absolute bottom-0 left-0 right-0 top-0 flex flex-col" :style="{ paddingTop: `${statusBarHeight}px` }">
      <view class="relative z-10 flex flex-1 flex-col px-6 py-8">
        <!-- Logo 区域 -->
        <view class="flex flex-col items-center">
          <view class="h-20 w-20 flex items-center justify-center rounded-2xl bg-white shadow-xl">
            <image
              src="/static/images/logo.png"
              class="h-14 w-14"
              mode="aspectFit"
            />
          </view>
          <text class="mt-4 text-2xl text-gray-800 font-bold">{{ appName }}</text>
          <text class="mt-2 text-sm text-gray-500">{{ appDescription }}</text>
        </view>

        <!-- 登录表单区域 -->
        <view class="mt-8 flex flex-1 flex-col justify-center">
          <view class="mb-6 text-center">
            <text class="text-lg text-gray-700 font-medium">欢迎使用</text>
            <view class="mt-1">
              <text class="text-sm text-gray-400">请登录以继续</text>
            </view>
          </view>

          <!-- 手机号输入 -->
          <view class="mb-4 flex items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 px-4">
            <text class="mr-2 text-sm text-gray-500">+86</text>
            <input
              v-model="phone"
              type="number"
              :maxlength="11"
              placeholder="请输入手机号"
              class="h-12 flex-1 text-sm text-gray-800"
              placeholder-class="text-gray-400"
            />
          </view>

          <!-- 验证码输入 -->
          <view class="mb-6 flex items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 px-4">
            <input
              v-model="smsCode"
              type="number"
              :maxlength="6"
              placeholder="请输入验证码"
              class="h-12 flex-1 text-sm text-gray-800"
              placeholder-class="text-gray-400"
            />
            <view
              class="ml-2 flex-shrink-0 px-3 py-1.5 text-sm rounded-lg"
              :class="countdown > 0 ? 'text-gray-400 bg-gray-200' : 'text-blue-500 bg-blue-50'"
              @click="onSendCode"
            >
              <text>{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
            </view>
          </view>

          <!-- 登录按钮 -->
          <button
            class="h-13 w-full flex items-center justify-center rounded-full border-none shadow-lg"
            :class="isLoading ? 'opacity-70' : ''"
            :style="{
              background: 'linear-gradient(to right, #3b82f6, #2563eb)',
              padding: 0,
            }"
            :disabled="isLoading"
            @click="onLogin"
          >
            <view v-if="isLoading" class="mr-2 h-5 w-5 animate-spin border-2 border-white border-t-transparent rounded-full" />
            <text class="text-base text-white font-semibold">{{ isLoading ? '登录中...' : '登录' }}</text>
          </button>

          <!-- 调试模式快速登录（仅开发环境） -->
          <view v-if="isDev" class="mt-3">
            <button
              class="h-10 w-full flex items-center justify-center rounded-full border-none"
              :style="{ background: '#f3f4f6', color: '#6b7280' }"
              @click="onDevSkipLogin"
            >
              <text class="text-sm">🛠 调试：跳过登录</text>
            </button>
          </view>

          <!-- 协议勾选 -->
          <view class="mt-10 flex items-center px-1">
            <view
              class="flex flex-shrink-0 items-center justify-center rounded"
              :style="{
                width: '18px',
                height: '18px',
                border: agreed ? '2px solid #3b82f6' : '2px solid #d1d5db',
                backgroundColor: agreed ? '#3b82f6' : '#ffffff',
                boxSizing: 'border-box',
              }"
              @click="toggleAgreement"
            >
              <text v-if="agreed" style="color: #ffffff; font-size: 12px; line-height: 1; font-weight: bold;">✓</text>
            </view>
            <view class="ml-2 flex-1 text-xs text-gray-500" style="line-height: 1.6">
              <text>我已阅读并同意</text>
              <text class="text-blue-500 font-medium" style="text-decoration: underline" @click.stop="onAgreementClick">《用户服务协议》</text>
              <text>和</text>
              <text class="text-blue-500 font-medium" style="text-decoration: underline" @click.stop="onAgreementClick">《隐私政策》</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
button {
  border: none;
  padding: 0;
  line-height: normal;
}

button::after {
  border: none;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
