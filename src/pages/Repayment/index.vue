<template>
  <view class="repayment-container">
    <view class="repayment-content">
      <view class="section-title">
        还款设置
      </view>
      <view class="form-item">
        <text class="form-label">贷款类型</text>
        <picker
          mode="selector"
          :range="loanTypeOptions"
          :value="loanTypeIndex"
          @change="onLoanTypeChange"
        >
          <view class="form-input picker-input">
            {{ loanTypeIndex !== -1 ? loanTypeOptions[loanTypeIndex] : '请选择贷款类型' }}
          </view>
        </picker>
      </view>
      <view class="form-item">
        <text class="form-label">还款金额</text>
        <input
          v-model="actualAmount"
          class="form-input"
          type="number"
          placeholder="请输入还款金额"
        >
      </view>
      <view class="form-item">
        <text class="form-label">还款周期</text>
        <picker
          mode="selector"
          :range="cycleOptions"
          :value="cycleIndex"
          @change="onCycleChange"
        >
          <view class="form-input picker-input">
            {{ cycleIndex !== -1 ? cycleOptions[cycleIndex] : '请选择还款周期' }}
          </view>
        </picker>
      </view>
      <view class="form-item">
        <text class="form-label">开始日期</text>
        <picker
          mode="date"
          :value="actualDate"
          @change="onactualDateChange"
        >
          <view class="form-input picker-input">
            {{ actualDate || '请选择开始日期' }}
          </view>
        </picker>
      </view>
      <view class="form-item">
        <text class="form-label">备注</text>
        <input
          v-model="remark"
          class="form-input"
          type="text"
          placeholder="可填写备注"
        >
      </view>
      <view class="action-buttons">
        <button class="btn btn-cancel" @click="handleCancel">
          取消
        </button>
        <button class="btn btn-confirm" @click="handleSubmit">
          确认还款
        </button>
      </view>
      <!-- 展示已选信息 -->
      <view v-if="showSummary" class="repay-summary">
        <view class="summary-title">
          还款信息预览
        </view>
        <view class="summary-row">
          <text class="summary-label">贷款类型：</text>
          <text>{{ loanTypeIndex !== -1 ? loanTypeOptions[loanTypeIndex] : '-' }}</text>
        </view>
        <view class="summary-row">
          <text class="summary-label">还款金额：</text>
          <text>{{ actualAmount || '-' }}</text>
        </view>
        <view class="summary-row">
          <text class="summary-label">还款周期：</text>
          <text>{{ cycleIndex !== -1 ? cycleOptions[cycleIndex] : '-' }}</text>
        </view>
        <view class="summary-row">
          <text class="summary-label">开始日期：</text>
          <text>{{ actualDate || '-' }}</text>
        </view>
        <view class="summary-row">
          <text class="summary-label">备注：</text>
          <text>{{ remark || '-' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '贷款计划',
  },
})

const loanTypeOptions = ['信用贷', '车贷', '房贷', '消费贷', '经营贷']
const loanTypeIndex = ref(-1)

const cycleOptions = ['每月', '每季', '每半年', '每年']
const cycleIndex = ref(-1)

const actualAmount = ref('')
const actualDate = ref('')
const remark = ref('')

const showSummary = ref(false)

const REPAYMENT_ADD_API = '/dental-finance/repayment/repaymentPlan/add'

function onLoanTypeChange(e: any) {
  loanTypeIndex.value = e.detail.value
}

function onCycleChange(e: any) {
  cycleIndex.value = e.detail.value
}

function onactualDateChange(e: any) {
  actualDate.value = e.detail.value
}

function handleCancel() {
  uni.navigateBack()
}

function handleSubmit() {
  if (
    loanTypeIndex.value === -1
    || !actualAmount.value
    || cycleIndex.value === -1
    || !actualDate.value
  ) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }

  const payload = {
    loanType: loanTypeOptions[loanTypeIndex.value],
    actualAmount: Number(actualAmount.value),
    cycle: cycleOptions[cycleIndex.value],
    actualDate: actualDate.value,
    remark: remark.value.trim(),
  }

  uni.showLoading({ title: '提交中...' })
  uni.request({
    url: REPAYMENT_ADD_API,
    method: 'POST',
    data: payload,
    header: { 'Content-Type': 'application/json' },
    success: (res: any) => {
      const ok = res?.statusCode === 200 && (res?.data?.code === 200 || res?.data?.code === 0 || res?.data?.success === true)
      if (ok) {
        uni.showToast({ title: '提交成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateTo({ url: '/pages/Process/index' })
        }, 500)
        return
      }
      uni.showToast({ title: res?.data?.message || '提交失败', icon: 'none' })
    },
    fail: () => {
      uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' })
    },
    complete: () => {
      uni.hideLoading()
    },
  })
}
</script>

<style lang="scss" scoped>
// filepath: d:\PartTimeJob\DentalPlatformJob\DentalPlatform\src\pages\Repayment\index.vue
.repayment-container {
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 30rpx 24rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
.repayment-content {
  width: 100%;
  max-width: 680rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
  padding: 48rpx 40rpx;
  box-sizing: border-box;
  transition: all 0.3s ease;

  .section-title {
    font-size: 40rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 50rpx;
    text-align: left;
    position: relative;
    padding-left: 20rpx;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 8rpx;
      height: 32rpx;
      background: #1890ff;
      border-radius: 4rpx;
    }
  }

  .form-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 40rpx;

    .form-label {
      font-size: 28rpx;
      color: #555;
      margin-bottom: 16rpx;
      font-weight: 600;
    }

    .form-input {
      height: 88rpx;
      line-height: 88rpx;
      padding: 0 24rpx;
      background: #f9f9f9;
      border-radius: 12rpx;
      font-size: 30rpx;
      color: #333;
      border: 2rpx solid transparent;
      transition: all 0.3s;

      &:focus {
        background: #fff;
        border-color: #1890ff;
        box-shadow: 0 0 0 4rpx rgba(24, 144, 255, 0.1);
      }
    }

    .picker-input {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &::after {
        content: '▼';
        font-size: 20rpx;
        color: #999;
        margin-left: 10rpx;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 30rpx;
    margin-top: 60rpx;

    .btn {
      flex: 1;
      height: 96rpx;
      line-height: 96rpx;
      border-radius: 48rpx;
      font-size: 32rpx;
      font-weight: 600;
      border: none;
      transition: opacity 0.2s;

      &:active {
        opacity: 0.8;
      }

      &.btn-cancel {
        background: #f5f5f5;
        color: #666;
      }

      &.btn-confirm {
        background: linear-gradient(135deg, #1890ff, #0050b3);
        color: #fff;
        box-shadow: 0 4rpx 16rpx rgba(24, 144, 255, 0.3);
      }
    }
  }

  .repay-summary {
    margin-top: 50rpx;
    padding: 30rpx;
    background: #e6f7ff;
    border: 2rpx solid #bae7ff;
    border-radius: 16rpx;

    .summary-title {
      font-size: 32rpx;
      font-weight: 700;
      color: #0050b3;
      margin-bottom: 24rpx;
      text-align: center;
      border-bottom: 2rpx dashed #91d5ff;
      padding-bottom: 20rpx;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;
      color: #333;
      margin-bottom: 16rpx;
      line-height: 1.6;

      .summary-label {
        color: #666;
      }

      text:last-child {
        font-weight: 500;
        color: #333;
      }
    }
  }
}
</style>
