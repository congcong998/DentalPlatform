<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from '@uni-helper/uni-promises'
import { useUserStore } from '@/store/user'
import { appDescription, appName } from '@/settings/index'
import { sleep } from '@/utils'

const userStore = useUserStore()

const statusBarHeight = ref(44)
const agreed = ref(false)
const isLoading = ref(false)

defineOptions({
  name: 'Login',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '登录',
    disableScroll: true,
  },
})

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 44
})

async function onLoginClick(e) {
  // 阻止默认行为
  if (!agreed.value) {
    // 阻止授权弹窗
    e.stopPropagation()
    e.preventDefault()

    await showToast({
      title: '请先同意服务协议',
      icon: 'none',
    })
    return false
  }

  return true
}

async function onGetUserInfo(e) {
  // 先检查是否同意协议
  if (!agreed.value) {
    await showToast({
      title: '请先同意服务协议',
      icon: 'none',
    })
    return
  }

  const { userInfo, errMsg } = e.detail

  if (errMsg.includes('ok') && userInfo) {
    try {
      isLoading.value = true

      // 1. 获取登录凭证
      const { code } = await uni.login({ provider: 'weixin' })

      // TODO: 调用后端接口，传递 code 和 userInfo 进行登录验证
      // const res = await api.login({ code, userInfo })

      // 模拟登录成功，保存用户信息
      const mockUserInfo = {
        userId: 1,
        username: userInfo.nickName,
        nickname: userInfo.nickName,
        avatar: userInfo.avatarUrl,
      }

      userStore.setUserInfo(mockUserInfo)
      uni.setStorageSync('token', 'mock_token_' + Date.now())

      await showToast({
        title: '登录成功',
        icon: 'success',
      })

      await sleep(500)

      uni.switchTab({
        url: '/pages/index/index',
      })
    } catch (error) {
      console.error('登录失败:', error)
      await showToast({
        title: '登录失败，请重试',
        icon: 'error',
      })
    } finally {
      isLoading.value = false
    }
  } else if (errMsg.includes('fail')) {
    await showToast({
      title: '需要授权才能登录',
      icon: 'none',
    })
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
    <view :style="{ height: statusBarHeight + 'px' }" />

    <!-- 主内容区 - 使用绝对定位避免滚动 -->
    <view class="absolute left-0 right-0 top-0 bottom-0 flex flex-col" :style="{ paddingTop: statusBarHeight + 'px' }">
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
        <view class="mt-8 flex-1 flex flex-col justify-center">
          <view class="mb-6 text-center">
            <text class="text-lg text-gray-700 font-medium">欢迎使用</text>
            <view class="mt-1">
              <text class="text-sm text-gray-400">请登录以继续</text>
            </view>
          </view>

          <!-- 登录按钮 -->
          <button
            v-if="agreed"
            class="h-13 w-full flex items-center justify-center rounded-full shadow-lg border-none"
            :class="isLoading ? 'opacity-70' : ''"
            :style="{
              background: 'linear-gradient(to right, #3b82f6, #2563eb)',
              padding: 0,
            }"
            :disabled="isLoading"
            open-type="getUserInfo"
            @getuserinfo="onGetUserInfo"
          >
            <view v-if="isLoading" class="mr-2 h-5 w-5 animate-spin border-2 border-white border-t-transparent rounded-full" />
            <text class="text-base text-white font-semibold">{{ isLoading ? '登录中...' : '微信授权登录' }}</text>
          </button>

          <!-- 未同意协议时显示的按钮 -->
          <view
            v-else
            class="h-13 w-full flex items-center justify-center rounded-full shadow-lg opacity-50"
            :style="{
              background: 'linear-gradient(to right, #3b82f6, #2563eb)',
            }"
            @click="onLoginClick"
          >
            <text class="text-base text-white font-semibold">微信授权登录</text>
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
                boxSizing: 'border-box'
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
