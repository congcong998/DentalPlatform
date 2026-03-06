<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'Developing',
})

definePage({
  style: {
    navigationBarTitleText: '功能开发中',
  },
})

const statusBarHeight = ref(44)

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 44
})

function goBack() {
  uni.navigateBack()
}
</script>

<template>
  <view class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <!-- 图标 -->
    <view class="mb-6">
      <view class="h-32 w-32 flex items-center justify-center rounded-full bg-blue-50">
        <text class="text-6xl">🚧</text>
      </view>
    </view>

    <!-- 标题 -->
    <text class="text-2xl text-gray-800 font-bold">功能开发中</text>

    <!-- 描述 -->
    <text class="mt-3 px-8 text-center text-sm text-gray-500">
      该功能正在努力开发中，敬请期待...
    </text>

    <!-- 返回按钮 -->
    <view class="mt-8">
      <view
        class="rounded-full px-12 py-3 shadow-md"
        style="background: linear-gradient(to right, #3b82f6, #2563eb)"
        @click="goBack"
      >
        <text class="text-white font-medium">返回上一页</text>
      </view>
    </view>
  </view>
</template>
