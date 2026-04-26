<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { getRepaymentPlanList, type IRepaymentPlan } from '@/api/repayment'

defineOptions({
  name: 'Home',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '还款计划',
  },
})

const userStore = useUserStore()
const statusBarHeight = ref(44)
const isLogin = computed(() => !!userStore.userInfo?.userId)
const isLoading = ref(false)

// 还款计划列表
const repaymentPlan = ref<IRepaymentPlan[]>([])

// 统计信息
const totalAmount = computed(() =>
  repaymentPlan.value.reduce((sum, item) => sum + (item.planAmount || 0), 0),
)
const paidAmount = computed(() =>
  repaymentPlan.value
    .filter(item => item.repaymentStatus === '1')
    .reduce((sum, item) => sum + (item.actualAmount || item.planAmount || 0), 0),
)
const remainingAmount = computed(() => totalAmount.value - paidAmount.value)
const paidCount = computed(() =>
  repaymentPlan.value.filter(item => item.repaymentStatus === '1').length,
)
const progress = computed(() => {
  if (!totalAmount.value)
    return '0.0'
  return (paidAmount.value / totalAmount.value * 100).toFixed(1)
})

// 状态映射
function getStatusText(status: string) {
  const map: Record<string, string> = {
    '0': '未还款',
    '1': '已还款',
    '2': '部分还款',
    '3': '逾期',
  }
  return map[status] || ''
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    '0': 'text-gray-400',
    '1': 'text-green-500',
    '2': 'text-orange-500',
    '3': 'text-red-500',
  }
  return map[status] || ''
}

// 格式化日期
function formatDate(dateStr: string) {
  if (!dateStr)
    return '-'
  return dateStr.split('T')[0]
}

async function loadRepaymentPlan() {
  try {
    isLoading.value = true
    const res = await getRepaymentPlanList()
    if (res?.records) {
      repaymentPlan.value = res.records.sort((a, b) => a.seqNo - b.seqNo)
    }
  }
  catch (error) {
    console.error('获取还款计划失败:', error)
    uni.showToast({ title: '获取数据失败', icon: 'none' })
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 44
  loadRepaymentPlan()
})

function handleRepay() {
  if (!isLogin.value) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    // #ifdef H5
    uni.navigateTo({ url: '/pages/login-h5/index' })
    // #endif
    // #ifndef H5
    uni.navigateTo({ url: '/pages/login/index' })
    // #endif
    return
  }
  uni.navigateTo({ url: '/pages/repayment/index' })
}

function handleDetail(item: IRepaymentPlan) {
  uni.navigateTo({
    url: `/pages/repayment/detail?id=${item.id}`,
  })
}
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <view class="bg-white">
      <view :style="{ height: `${statusBarHeight}px` }" />
      <view class="h-11 flex items-center justify-center">
        <text class="text-lg text-gray-800 font-medium">还款计划</text>
      </view>
    </view>

    <!-- 贷款概览卡片 -->
    <view class="mx-4 mt-4 overflow-hidden rounded-xl from-blue-500 to-blue-600 bg-gradient-to-br p-5 shadow-lg">
      <view class="mb-4">
        <text class="text-sm text-white/80">剩余还款金额</text>
        <view class="mt-1 flex items-baseline">
          <text class="text-3xl text-white font-bold">{{ (remainingAmount / 10000).toFixed(2) }}</text>
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
          <view class="h-full rounded-full bg-white" :style="{ width: `${progress}%` }" />
        </view>
      </view>

      <!-- 贷款信息 -->
      <view class="flex justify-between">
        <view class="flex-1">
          <text class="text-xs text-white/70">总金额</text>
          <text class="mt-1 block text-base text-white font-medium">¥{{ totalAmount.toFixed(2) }}</text>
        </view>
        <view class="flex-1">
          <text class="text-xs text-white/70">已还期数</text>
          <text class="mt-1 block text-base text-white font-medium">{{ paidCount }}/{{ repaymentPlan.length }}</text>
        </view>
        <view class="flex-1">
          <text class="text-xs text-white/70">已还金额</text>
          <text class="mt-1 block text-base text-white font-medium">¥{{ paidAmount.toFixed(2) }}</text>
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
    <view class="mx-4 mb-4 mt-4">
      <view class="mb-3 flex items-center justify-between">
        <text class="text-base text-gray-800 font-medium">还款计划明细</text>
        <text class="text-xs text-gray-400">共 {{ repaymentPlan.length }} 期</text>
      </view>

      <!-- 加载中 -->
      <view v-if="isLoading" class="flex items-center justify-center py-10">
        <text class="text-sm text-gray-400">加载中...</text>
      </view>

      <!-- 空数据 -->
      <view v-else-if="repaymentPlan.length === 0" class="flex items-center justify-center py-10">
        <text class="text-sm text-gray-400">暂无还款计划</text>
      </view>

      <view v-else class="overflow-hidden rounded-xl bg-white shadow-sm">
        <view
          v-for="(item, index) in repaymentPlan"
          :key="item.id"
          class="border-b border-gray-100 px-4 py-3 active:bg-gray-50"
          :class="{ 'border-b-0': index === repaymentPlan.length - 1 }"
          @click="handleDetail(item)"
        >
          <view class="flex items-center justify-between">
            <view class="flex-1">
              <view class="flex items-center">
                <text class="text-base text-gray-800 font-medium">第 {{ item.seqNo }} 期</text>
                <text class="ml-2 text-xs" :class="getStatusColor(item.repaymentStatus)">
                  {{ getStatusText(item.repaymentStatus) }}
                </text>
              </view>
              <text class="mt-1 block text-xs text-gray-400">计划日期：{{ formatDate(item.planDate) }}</text>
              <text v-if="item.actualDate" class="block text-xs text-gray-400">实还日期：{{ formatDate(item.actualDate) }}</text>
            </view>
            <view class="text-right">
              <text class="text-base text-gray-800 font-medium">¥{{ item.planAmount?.toFixed(2) }}</text>
              <view v-if="item.actualAmount" class="mt-1 text-xs text-green-500">
                <text>实还 ¥{{ item.actualAmount?.toFixed(2) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="h-20" />
  </view>
</template>
