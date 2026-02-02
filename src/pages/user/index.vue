<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'

defineOptions({
  name: 'User',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
  },
})

const userStore = useUserStore()

const isLogin = computed(() => !!userStore.userInfo?.userId)
const userInfo = computed(() => userStore.userInfo || {} as Record<string, any>)

// 统计数据
const statsItems = [
  { label: '我的预约', value: '3', path: '/pages/developing/list' },
  { label: '就诊记录', value: '12', path: '/pages/developing/list' },
  { label: '待还款项', value: '3', path: '/pages/developing/index' },
]

// 服务菜单
const serviceItems = [
  { icon: 'i-carbon-calendar', text: '预约挂号', path: '/pages/developing/create', color: 'text-blue-500' },
  { icon: 'i-carbon-document', text: '就诊记录', path: '/pages/developing/list', color: 'text-green-500' },
  { icon: 'i-carbon-user-profile', text: '我的档案', path: '/pages/developing/index', color: 'text-orange-500' },
  { icon: 'i-carbon-qr-code', text: '我的邀请码', path: '/pages/invite/index', color: 'text-purple-500' },
]

// 工具菜单
const toolItems = [
  { icon: 'i-carbon-settings', text: '系统设置', path: '/pages/developing/index', requireLogin: false },
  { icon: 'i-carbon-help', text: '帮助中心', path: '/pages/developing/index', requireLogin: false },
  { icon: 'i-carbon-phone', text: '联系客服', path: '/pages/developing/index', requireLogin: false },
  { icon: 'i-carbon-information', text: '关于我们', path: '/pages/developing/index', requireLogin: false },
]

const statusBarHeight = ref(44)

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 44
})

function handleLogin() {
  if (isLogin.value) {
    uni.navigateTo({
      url: '/pages/profile/edit',
    })
    return
  }
  uni.navigateTo({
    url: '/pages/login/index',
  })
}

function handleMenuClick(item: any) {
  console.log('Menu click:', item)
  // 特殊处理邀请码
  if (item.path === '/pages/invite/index') {
    if (!isLogin.value) {
      uni.showToast({ title: '请先登录', icon: 'none' })
      uni.navigateTo({
        url: '/pages/login/index',
      })
      return
    }
    showInviteCode()
    return
  }

  if (item.requireLogin !== false && !isLogin.value) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    uni.navigateTo({
      url: '/pages/login/index',
    })
    return
  }
  uni.navigateTo({
    url: item.path,
  })
}

function showInviteCode() {
  console.log('Show invite code called')
  // 生成或获取邀请码
  const inviteCode = userInfo.value?.inviteCode || generateInviteCode()

  console.log('Invite code:', inviteCode)

  uni.showModal({
    title: '我的邀请码',
    content: `您的邀请码是：${inviteCode}\n\n邀请好友注册可获得积分奖励`,
    showCancel: true,
    confirmText: '复制',
    cancelText: '关闭',
    success: (res) => {
      console.log('Modal result:', res)
      if (res.confirm) {
        uni.setClipboardData({
          data: inviteCode,
          success: () => {
            uni.showToast({
              title: '已复制到剪贴板',
              icon: 'success',
            })
          },
          fail: (err) => {
            console.error('Copy failed:', err)
            uni.showToast({
              title: '复制失败',
              icon: 'none',
            })
          },
        })
      }
    },
    fail: (err) => {
      console.error('Modal failed:', err)
    },
  })
}

function generateInviteCode() {
  // 生成6位邀请码
  const userId = userInfo.value?.userId || 1
  return `INV${userId.toString().padStart(6, '0')}`
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        userStore.clearUserInfo()
        uni.removeStorageSync('token')

        await uni.showToast({
          title: '退出成功',
          icon: 'success',
          duration: 1000,
        })

        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/login/index',
          })
        }, 1000)
      }
    },
  })
}
</script>

<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 顶部背景 -->
    <view class="bg-gradient-to-br from-blue-500 to-blue-600 pb-20">
      <!-- 状态栏占位 -->
      <view :style="{ height: statusBarHeight + 'px' }" />

      <!-- 页面标题 -->
      <view class="h-11 flex items-center justify-center">
        <text class="text-lg text-white font-medium">我的</text>
      </view>

      <!-- 用户信息 -->
      <view class="px-5 mt-4" @click="handleLogin">
        <view class="flex items-center">
          <!-- 头像 -->
          <view class="relative">
            <image
              :src="userInfo?.avatar || '/static/avatar-default.png'"
              class="h-18 w-18 border-3 border-white/40 rounded-full bg-white"
              mode="aspectFill"
            />
            <view v-if="isLogin" class="absolute bottom-0 right-0 h-4 w-4 border-2 border-white rounded-full bg-green-400" />
          </view>

          <!-- 用户名 -->
          <view class="ml-4 flex-1">
            <view class="text-xl text-white font-bold">
              {{ isLogin ? (userInfo?.nickname || userInfo?.phone || '用户') : '点击登录' }}
            </view>
            <view class="mt-1 text-sm text-white/70">
              {{ isLogin ? (userInfo?.phone || '欢迎回来') : '登录享受更多服务' }}
            </view>
          </view>

          <!-- 箭头 -->
          <view class="i-carbon-chevron-right text-2xl text-white/60" />
        </view>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view v-if="isLogin" class="mx-4 mt-[-60px] overflow-hidden rounded-xl bg-white p-4 shadow-md">
      <view class="flex justify-around">
        <view
          v-for="item in statsItems"
          :key="item.label"
          class="flex flex-1 flex-col items-center py-2"
          @click="handleMenuClick(item)"
        >
          <text class="text-2xl text-blue-500 font-bold">{{ item.value }}</text>
          <text class="mt-1 text-xs text-gray-500">{{ item.label }}</text>
        </view>
      </view>
    </view>

    <!-- 未登录占位 -->
    <view v-else class="mx-4 mt-[-60px] overflow-hidden rounded-xl bg-white p-6 shadow-md">
      <view class="flex flex-col items-center">
        <text class="text-gray-400">登录后查看更多信息</text>
        <button
          class="mt-3 bg-blue-500 px-8 py-2 text-sm text-white rounded-full"
          @click="handleLogin"
        >
          立即登录
        </button>
      </view>
    </view>

    <!-- 服务菜单 -->
    <view v-if="isLogin" class="mx-4 mt-4 overflow-hidden rounded-xl bg-white p-4 shadow-sm">
      <view class="mb-3 text-base text-gray-800 font-medium">
        我的服务
      </view>
      <view class="grid grid-cols-4 gap-2">
        <view
          v-for="item in serviceItems"
          :key="item.text"
          class="flex flex-col items-center py-3"
          @click.stop="handleMenuClick(item)"
        >
          <view :class="[item.icon, item.color]" class="text-3xl" />
          <text class="mt-2 text-xs text-gray-600">{{ item.text }}</text>
        </view>
      </view>
    </view>

    <!-- 工具菜单 -->
    <view class="mx-4 mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
      <view class="border-b border-gray-100 px-4 py-3 text-base text-gray-800 font-medium">
        更多服务
      </view>
      <view
        v-for="(item, index) in toolItems"
        :key="item.text"
        class="flex items-center px-4 py-4 active:bg-gray-50"
        :class="{ 'border-b border-gray-100': index !== toolItems.length - 1 }"
        @click="handleMenuClick(item)"
      >
        <view :class="item.icon" class="text-xl text-gray-500" />
        <text class="ml-3 flex-1 text-gray-700">{{ item.text }}</text>
        <view class="i-carbon-chevron-right text-gray-400" />
      </view>
    </view>

    <!-- 退出登录 -->
    <view v-if="isLogin" class="mx-4 mt-6 mb-8">
      <button
        class="w-full border border-gray-200 bg-white py-3 text-red-500 rounded-xl shadow-sm active:bg-gray-50"
        @click="handleLogout"
      >
        退出登录
      </button>
    </view>

    <!-- 版本信息 -->
    <view class="py-6 text-center text-xs text-gray-400">
      版本 v1.0.0
    </view>

    <view class="h-[var(--safe-area-inset-bottom)]" />
  </view>
</template>
