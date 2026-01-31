<template>
  <view class="process-container">
    <!-- 步骤条 -->
    <view class="steps-header">
      <view class="step-item" :class="{ active: currentStep >= 1 }">
        <view class="step-num">
          1
        </view>
        <text>信息补充</text>
      </view>
      <view class="step-line" :class="{ active: currentStep >= 2 }" />
      <view class="step-item" :class="{ active: currentStep >= 2 }">
        <view class="step-num">
          2
        </view>
        <text>电子签</text>
      </view>
      <view class="step-line" :class="{ active: currentStep >= 3 }" />
      <view class="step-item" :class="{ active: currentStep >= 3 }">
        <view class="step-num">
          3
        </view>
        <text>验证签约</text>
      </view>
    </view>

    <view class="process-content">
      <!-- 步骤1: 基本信息补充 & OCR -->
      <view v-if="currentStep === 1" class="step-section">
        <view class="section-title">
          证件信息
        </view>

        <!-- 身份证正面 -->
        <view class="upload-card" @click="chooseImage('idFront')">
          <image v-if="form.idFront" :src="form.idFront" mode="aspectFit" class="card-img" />
          <view v-else class="upload-placeholder">
            <text class="icon">📷</text>
            <text>上传身份证正面 (人像面)</text>
          </view>
        </view>
        <view class="form-row">
          <input v-model="form.name" class="common-input" placeholder="姓名 (OCR识别自动填充)">
        </view>
        <view class="form-row">
          <input v-model="form.idNo" class="common-input" placeholder="身份证号 (OCR识别自动填充)" maxlength="18">
        </view>

        <!-- 身份证反面 -->
        <view class="upload-card mt-20" @click="chooseImage('idBack')">
          <image v-if="form.idBack" :src="form.idBack" mode="aspectFit" class="card-img" />
          <view v-else class="upload-placeholder">
            <text class="icon">📷</text>
            <text>上传身份证反面 (国徽面)</text>
          </view>
        </view>

        <view class="section-title mt-40">
          银行卡信息
        </view>
        <view class="upload-card" @click="chooseImage('bankCard')">
          <image v-if="form.bankImg" :src="form.bankImg" mode="aspectFit" class="card-img" />
          <view v-else class="upload-placeholder">
            <text class="icon">💳</text>
            <text>上传银行卡正面</text>
          </view>
        </view>
        <view class="form-row">
          <input v-model="form.bankNo" class="common-input" type="number" placeholder="银行卡号 (OCR识别自动填充)">
        </view>

        <button class="btn-primary mt-40" @click="nextStep">
          下一步
        </button>
      </view>

      <!-- 步骤2: 电子签 -->
      <view v-if="currentStep === 2" class="step-section">
        <view class="section-title">
          电子合同签署
        </view>
        <view class="contract-box">
          <text class="contract-text">在此处显示合同条款内容...</text>
          <text class="contract-text">1. 借款人需按时还款...</text>
          <text class="contract-text">2. 逾期将产生罚息...</text>
        </view>

        <view class="signature-box" @click="handleSign">
          <view v-if="!signatureImage" class="sign-placeholder">
            点击此处进行手写签名
          </view>
          <image v-else :src="signatureImage" mode="heightFix" class="sign-img" />
        </view>
        <view class="sign-tip">
          请在上方区域完成签名
        </view>

        <button class="btn-primary mt-40" @click="nextStep">
          下一步
        </button>
      </view>

      <!-- 步骤3: 验证 & 签约 -->
      <view v-if="currentStep === 3" class="step-section">
        <view class="section-title">
          验证与签约
        </view>

        <view class="verify-row">
          <text class="label">手机号</text>
          <text class="value">138****8888</text>
        </view>

        <view class="verify-input-group">
          <input v-model="verifyCode" type="number" placeholder="请输入验证码" class="code-input">
          <view class="get-code-btn" @click="getVerifyCode">
            获取验证码
          </view>
        </view>

        <view class="liveness-check" @click="startLivenessCheck">
          <view class="check-status">
            <text :class="livenessPassed ? 'success-icon' : 'pending-icon'">{{ livenessPassed ? '✓' : '○' }}</text>
            <text>{{ livenessPassed ? '活体检测已通过' : '点击开始活体检测' }}</text>
          </view>
        </view>

        <view class="agreement-check">
          <checkbox-group @change="onAgreementChange">
            <label class="agreement-label">
              <checkbox value="agree" :checked="isAgreed" />
              <text>我已阅读并同意《自动代扣款协议》</text>
            </label>
          </checkbox-group>
        </view>

        <button class="btn-primary mt-40" :disabled="!canSubmit" @click="submitAll">
          完成签约
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const currentStep = ref(1)

// 步骤1数据
const form = ref({
  name: '',
  idNo: '',
  idFront: '',
  idBack: '',
  bankImg: '',
  bankNo: '',
})

// 步骤2数据
const signatureImage = ref('')

// 步骤3数据
const verifyCode = ref('')
const livenessPassed = ref(false)
const isAgreed = ref(true)

const canSubmit = computed(() => {
  return verifyCode.value.length >= 4 && livenessPassed.value && isAgreed.value
})

// 图片选择与OCR模拟
function chooseImage(type: 'idFront' | 'idBack' | 'bankCard') {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const filePath = res.tempFilePaths[0]
      if (type === 'idFront') {
        form.value.idFront = filePath
        // 模拟OCR
        uni.showLoading({ title: '识别中...' })
        setTimeout(() => {
          form.value.name = '张三'
          form.value.idNo = '370202199001018888'
          uni.hideLoading()
        }, 800)
      }
      else if (type === 'idBack') {
        form.value.idBack = filePath
      }
      else if (type === 'bankCard') {
        form.value.bankImg = filePath
        // 模拟OCR
        uni.showLoading({ title: '识别中...' })
        setTimeout(() => {
          form.value.bankNo = '6222021234567890'
          uni.hideLoading()
        }, 800)
      }
    },
  })
}

function nextStep() {
  if (currentStep.value === 1) {
    if (!form.value.name || !form.value.bankNo) {
      uni.showToast({ title: '请完善信息', icon: 'none' })
      return
    }
    currentStep.value = 2
  }
  else if (currentStep.value === 2) {
    if (!signatureImage.value) {
      uni.showToast({ title: '请完成签名', icon: 'none' })
      return
    }
    currentStep.value = 3
  }
}

// 模拟签名
function handleSign() {
  uni.showModal({
    title: '模拟签名',
    content: '此处调用手写板组件，点击确定模拟签名完成',
    success: (res) => {
      if (res.confirm) {
        // 使用个占位图或者base64
        signatureImage.value = 'https://via.placeholder.com/150x50?text=Signature'
      }
    },
  })
}

// 获取验证码
function getVerifyCode() {
  uni.showToast({ title: '验证码已发送', icon: 'none' })
}

// 活体检测
function startLivenessCheck() {
  uni.showLoading({ title: '检测中...' })
  setTimeout(() => {
    uni.hideLoading()
    livenessPassed.value = true
    uni.showToast({ title: '检测通过', icon: 'success' })
  }, 1500)
}

function onAgreementChange(e: any) {
  isAgreed.value = e.detail.value.length > 0
}

function submitAll() {
  uni.showToast({ title: '推广成功！签约完成', icon: 'success' })
  setTimeout(() => {
    uni.navigateBack({ delta: 2 }) // 返回到首页或列表
  }, 1500)
}
</script>

<style lang="scss" scoped>
.process-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 40rpx;
}

.steps-header {
  background: #fff;
  padding: 40rpx 60rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    font-size: 24rpx;
    color: #999;

    .step-num {
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
      background: #eee;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    &.active {
      color: #1890ff;
      .step-num {
        background: #1890ff;
        color: #fff;
      }
    }
  }

  .step-line {
    flex: 1;
    height: 4rpx;
    background: #eee;
    margin: 0 20rpx;
    margin-bottom: 30rpx; // Align with circle center visually

    &.active {
      background: #1890ff;
    }
  }
}

.process-content {
  padding: 0 30rpx;
}

.step-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  .section-title {
    font-size: 32rpx;
    font-weight: 700;
    margin-bottom: 30rpx;
    padding-left: 16rpx;
    border-left: 8rpx solid #1890ff;
  }
}

.upload-card {
  background: #f9f9f9;
  border: 2rpx dashed #d9d9d9;
  border-radius: 12rpx;
  height: 360rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  overflow: hidden;
  position: relative;

  .card-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #999;
    gap: 10rpx;

    .icon {
      font-size: 48rpx;
    }
  }
}

.common-input {
  background: #f5f5f5;
  height: 88rpx;
  padding: 0 24rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.form-row {
  margin-bottom: 20rpx;
}

.mt-20 {
  margin-top: 20rpx;
}
.mt-40 {
  margin-top: 40rpx;
}

.btn-primary {
  background: linear-gradient(135deg, #1890ff, #096dd9);
  color: #fff;
  border-radius: 44rpx;
  font-size: 32rpx;

  &:disabled {
    opacity: 0.6;
    background: #ccc;
  }
}

// Contract Styles
.contract-box {
  height: 400rpx;
  background: #f9f9f9;
  border-radius: 8rpx;
  padding: 20rpx;
  overflow-y: scroll;
  margin-bottom: 30rpx;

  .contract-text {
    display: block;
    font-size: 26rpx;
    color: #666;
    line-height: 1.8;
    margin-bottom: 10rpx;
  }
}

.signature-box {
  height: 300rpx;
  background: #fff;
  border: 2rpx solid #eee;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .sign-img {
    height: 100%;
  }

  .sign-placeholder {
    color: #ccc;
    font-size: 30rpx;
  }
}
.sign-tip {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

// Verify Styles
.verify-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
  font-size: 30rpx;
}

.verify-input-group {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;

  .code-input {
    flex: 1;
    background: #f5f5f5;
    height: 88rpx;
    padding: 0 24rpx;
    border-radius: 8rpx;
  }

  .get-code-btn {
    width: 200rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    color: #1890ff;
    border: 2rpx solid #1890ff;
    border-radius: 8rpx;
    font-size: 28rpx;
  }
}

.liveness-check {
  background: #f0f9ff;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 40rpx;

  .check-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    color: #1890ff;
    font-weight: 500;

    .success-icon {
      font-weight: bold;
      font-size: 32rpx;
    }
  }
}

.agreement-check {
  font-size: 24rpx;
  color: #666;
  text-align: center;

  .agreement-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;

    checkbox {
      transform: scale(0.8);
    }
  }
}
</style>
