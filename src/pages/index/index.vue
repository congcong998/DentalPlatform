<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'

defineOptions({
  name: 'Home',
})

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '还款计划',
  },
})

const userStore = useUserStore()
const statusBarHeight = ref(44)
const isLogin = computed(() => !!userStore.userInfo?.userId)

// 贷款信息
const loanInfo = ref({
  totalAmount: 50000, // 总贷款金额
  remainingAmount: 35000, // 剩余还款金额
  monthlyPayment: 2500, // 月供
  interestRate: 4.5, // 年利率
  loanTerm: 24, // 贷款期限（月）
  paidMonths: 6, // 已还期数
})

// 还款计划列表
const repaymentPlan = ref([
  { period: 1, date: '2024-01-15', principal: 2292, interest: 208, total: 2500, status: 'paid' },
  { period: 2, date: '2024-02-15', principal: 2301, interest: 199, total: 2500, status: 'paid' },
  { period: 3, date: '2024-03-15', principal: 2310, interest: 190, total: 2500, status: 'paid' },
  { period: 4, date: '2024-04-15', principal: 2319, interest: 181, total: 2500, status: 'paid' },
  { period: 5, date: '2024-05-15', principal: 2328, interest: 172, total: 2500, status: 'paid' },
  { period: 6, date: '2024-06-15', principal: 2337, interest: 163, total: 2500, status: 'paid' },
  { period: 7, date: '2024-07-15', principal: 2346, interest: 154, total: 2500, status: 'pending' },
  { period: 8, date: '2024-08-15', principal: 2355, interest: 145, total: 2500, status: 'unpaid' },
  { period: 9, date: '2024-09-15', principal: 2364, interest: 136, total: 2500, status: 'unpaid' },
  { period: 10, date: '2024-10-15', principal: 2373, interest: 127, total: 2500, status: 'unpaid' },
])

// 计算进度百分比
const progress = computed(() => {
  return ((loanInfo.value.totalAmount - loanInfo.value.remainingAmount) / loanInfo.value.totalAmount * 100).toFixed(1)
})

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 44
})

function handleRepay() {
  if (!isLogin.value) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    uni.navigateTo({ url: '/pages/login/index' })
    return
  }

  uni.navigateTo({ url: '/pages/repayment/index' })
}

function handleDetail(item: any) {
  uni.navigateTo({
    url: `/pages/repayment/detail?period=${item.period}`
  })
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    paid: '已还款',
    pending: '待还款',
    unpaid: '未到期',
  }
  return map[status] || ''
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    paid: 'text-green-500',
    pending: 'text-orange-500',
    unpaid: 'text-gray-400',
  }
  return map[status] || ''
}
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <view class="bg-white">
      <view :style="{ height: statusBarHeight + 'px' }" />
      <view class="h-11 flex items-center justify-center">
        <text class="text-lg text-gray-800 font-medium">还款计划</text>
      </view>
    </view>

    <!-- 贷款概览卡片 -->
    <view class="mx-4 mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 shadow-lg">
      <view class="mb-4">
        <text class="text-sm text-white/80">剩余还款金额</text>
        <view class="mt-1 flex items-baseline">
          <text class="text-3xl text-white font-bold">{{ (loanInfo.remainingAmount / 10000).toFixed(2) }}</text>
          <text class="ml-1 text-base text-white/80">万元</text>
        </view>
      </view>

      <!-- 还款进度 -->
      <view class="mb-4">
        <view class="mb-2 flex items-center justify-between">
          <text class="text-xs text-white/80">还款进度</text>
          <text class="text-xs text-white/80">{{ progress }}%</text>
        </view>
        <view class="h-2 overflow-hidden rounded-full bg-white/20">
          <view
            class="h-full rounded-full bg-white"
            :style="{ width: progress + '%' }"
          />
        </view>
      </view>

      <!-- 贷款信息 -->
      <view class="flex justify-between">
        <view class="flex-1">
          <text class="text-xs text-white/70">月供金额</text>
          <text class="mt-1 block text-base text-white font-medium">¥{{ loanInfo.monthlyPayment }}</text>
        </view>
        <view class="flex-1">
          <text class="text-xs text-white/70">已还期数</text>
          <text class="mt-1 block text-base text-white font-medium">{{ loanInfo.paidMonths }}/{{ loanInfo.loanTerm }}</text>
        </view>
        <view class="flex-1">
          <text class="text-xs text-white/70">年利率</text>
          <text class="mt-1 block text-base text-white font-medium">{{ loanInfo.interestRate }}%</text>
        </view>
      </view>
    </view>

    <!-- 立即还款按钮 -->
    <view class="mx-4 mt-4">
      <view
        class="flex items-center justify-center rounded-xl py-3 shadow-md"
        style="background: linear-gradient(to right, #f59e0b, #f97316)"
        @click="handleRepay"
      >
        <text class="text-base text-white font-medium">立即还款</text>
      </view>
    </view>

    <!-- 还款计划列表 -->
    <view class="mx-4 mt-4 mb-4">
      <view class="mb-3 flex items-center justify-between">
        <text class="text-base text-gray-800 font-medium">还款计划明细</text>
        <text class="text-xs text-gray-400">共 {{ loanInfo.loanTerm }} 期</text>
      </view>

      <view class="overflow-hidden rounded-xl bg-white shadow-sm">
        <view
          v-for="(item, index) in repaymentPlan"
          :key="item.period"
          class="border-b border-gray-100 px-4 py-3 active:bg-gray-50"
          :class="{ 'border-b-0': index === repaymentPlan.length - 1 }"
          @click="handleDetail(item)"
        >
          <view class="flex items-center justify-between">
            <view class="flex-1">
              <view class="flex items-center">
                <text class="text-base text-gray-800 font-medium">第 {{ item.period }} 期</text>
                <text :class="['ml-2 text-xs', getStatusColor(item.status)]">
                  {{ getStatusText(item.status) }}
                </text>
              </view>
              <text class="mt-1 block text-xs text-gray-400">{{ item.date }}</text>
            </view>
            <view class="text-right">
              <text class="text-base text-gray-800 font-medium">¥{{ item.total }}</text>
              <view class="mt-1 flex items-center text-xs text-gray-400">
                <text>本金¥{{ item.principal }}</text>
                <text class="ml-2">利息¥{{ item.interest }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="h-20" />
  </view>
</template>
