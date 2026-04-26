<template>
  <view class="process-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view :style="{ height: `${statusBarHeight}px` }" />
      <view class="navbar-content">
        <view class="navbar-back" @click="goBack">
          <text class="back-icon">‹</text>
        </view>
        <view class="navbar-title">
          办理流程
        </view>
        <view class="navbar-placeholder" />
      </view>
    </view>

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
        <text>合同信息补充</text>
      </view>
      <view class="step-line" :class="{ active: currentStep >= 3 }" />
      <view class="step-item" :class="{ active: currentStep >= 3 }">
        <view class="step-num">
          3
        </view>
        <text>乙方签署</text>
      </view>
      <view class="step-line" :class="{ active: currentStep >= 4 }" />
      <view class="step-item" :class="{ active: currentStep >= 4 }">
        <view class="step-num">
          4
        </view>
        <text>甲方签署</text>
      </view>
    </view>

    <view class="process-content">
      <!-- 步骤1: 信息补充 -->
      <view v-if="currentStep === 1" class="step-section">
        <view class="section-title">
          信息补充
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
          <input v-model="form.idCardNo" class="common-input" placeholder="身份证号 (OCR识别自动填充)" :maxlength="18">
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
          <input v-model="form.cardNumber" class="common-input" type="number" placeholder="银行卡号 (OCR识别自动填充)">
        </view>

        <button class="btn-primary mt-40" @click="nextStep">
          下一步
        </button>
      </view>

      <!-- 步骤2: 合同信息补充 -->
      <view v-if="currentStep === 2" class="step-section">
        <view class="section-title">
          合同信息补充
        </view>

        <view class="form-row">
          <view class="form-label">合同名称</view>
          <input v-model="contractForm.contractName" class="common-input" placeholder="请输入合同名称">
        </view>

        <view class="form-row">
          <view class="form-label">支付分期数量</view>
          <input v-model="contractForm.installmentCount" class="common-input" type="number" placeholder="请输入支付分期数量">
        </view>
        <view class="form-row">
          <view class="form-label">每期支付金额</view>
          <input v-model="contractForm.perAmount" class="common-input" type="digit" placeholder="请输入每期支付金额">
        </view>
        <view class="form-row">
          <view class="form-label">银行开户银行</view>
          <input v-model="contractForm.bankName" class="common-input" placeholder="请输入银行开户银行">
        </view>
        <view class="form-row">
          <view class="form-label">自愿宣传期数(月)</view>
          <input v-model="contractForm.publicityMonths" class="common-input" type="number" placeholder="请输入自愿宣传期数">
        </view>
        <view class="form-row">
          <view class="form-label">推荐客户数量</view>
          <input v-model="contractForm.recommendCount" class="common-input" type="number" placeholder="请输入推荐客户数量">
        </view>
        <view class="form-row">
          <view class="form-label">首次还款日期</view>
          <picker mode="date" :value="contractForm.firstRepaymentDate" @change="onFirstRepaymentDateChange">
            <view class="common-input flex items-center">{{ contractForm.firstRepaymentDate || '请选择首次还款日期' }}</view>
          </picker>
        </view>
        <view class="form-row">
          <view class="form-label">服务委托方</view>
          <picker mode="selector" :range="serviceProviderOptions" :value="contractForm.serviceProviderIndex" @change="onServiceProviderChange">
            <view class="common-input flex items-center">{{ serviceProviderOptions[contractForm.serviceProviderIndex] || '请选择服务委托方' }}</view>
          </picker>
        </view>

        <view class="form-row">
          <view class="form-label">医生签名</view>
          <input v-model="contractForm.doctorSign" class="common-input" placeholder="请输入医生签名">
        </view>

        <view class="form-row">
          <view class="form-label">签约地址</view>
          <input v-model="contractForm.signAddr" class="common-input" placeholder="请输入签约地址">
        </view>

        <button class="btn-primary mt-40" @click="nextStep">
          下一步
        </button>
      </view>

      <!-- 步骤3: 乙方签署 -->
      <view v-if="currentStep === 3" class="step-section">
        <view class="section-title">
          乙方签署
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

        <!-- 签字弹层 -->
        <view v-if="showSignPad && !isSigningForPartyA" class="sign-modal">
          <view class="sign-panel">
            <view class="sign-title">
              请在下方签字
            </view>
            <canvas
              id="signCanvas"
              canvas-id="signCanvas"
              class="sign-canvas"
              @touchstart.stop.prevent="onSignStart"
              @touchmove.stop.prevent="onSignMove"
              @touchend.stop.prevent="onSignEnd"
            />
            <view class="sign-actions">
              <button class="sign-btn" @click="clearSign">
                清空
              </button>
              <button class="sign-btn" @click="cancelSign">
                取消
              </button>
              <button class="sign-btn primary" @click="confirmSign">
                确认
              </button>
            </view>
          </view>
        </view>

        <button class="btn-primary mt-40" @click="nextStep">
          下一步
        </button>
      </view>

      <!-- 步骤4: 甲方签署 -->
      <view v-if="currentStep === 4" class="step-section">
        <view class="section-title">
          甲方签署
        </view>

        <view class="contract-box">
          <text class="contract-text">在此处显示合同条款内容...</text>
          <text class="contract-text">1. 甲方需按时付款...</text>
          <text class="contract-text">2. 逾期将产生违约责任...</text>
        </view>

        <view class="signature-box" @click="handlePartyASign">
          <view v-if="!partyASignatureImage" class="sign-placeholder">
            点击此处进行手写签名（甲方）
          </view>
          <image v-else :src="partyASignatureImage" mode="heightFix" class="sign-img" />
        </view>
        <view class="sign-tip">
          请在上方区域完成甲方签名
        </view>

        <!-- 签字弹层 -->
        <view v-if="showSignPad && isSigningForPartyA" class="sign-modal">
          <view class="sign-panel">
            <view class="sign-title">
              请在下方签字
            </view>
            <canvas
              id="signCanvas"
              canvas-id="signCanvas"
              class="sign-canvas"
              @touchstart.stop.prevent="onSignStart"
              @touchmove.stop.prevent="onSignMove"
              @touchend.stop.prevent="onSignEnd"
            />
            <view class="sign-actions">
              <button class="sign-btn" @click="clearSign">
                清空
              </button>
              <button class="sign-btn" @click="cancelSign">
                取消
              </button>
              <button class="sign-btn primary" @click="confirmSign">
                确认
              </button>
            </view>
          </view>
        </view>

        <view class="agreement-check mt-40">
          <checkbox-group @change="onAgreementChange">
            <label class="agreement-label">
              <checkbox value="agree" :checked="isAgreed" />
              <text>我已阅读并同意《服务协议》</text>
            </label>
          </checkbox-group>
        </view>

        <button class="btn-primary mt-40" :disabled="!canPartyASubmit" @click="submitAll">
          完成签约
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, onShow, ref } from 'vue'
import { http } from '@/http/http'
import {paasV2CreateContract, paasV2PartyASign, paasV2PartyBSign} from '@/api/paas_v2_api'
import { addCustomer, generateDentalContract, generateRecommendContract } from '@/api/customer_api'

defineOptions({
  name: 'Process',
})

definePage({
  style: {
    navigationBarTitleText: '签约流程',
  },
})

const statusBarHeight = ref(44)
const currentStep = ref(1)
const basicDraft = ref<Record<string, any>>({})
const contractDraft = ref<Record<string, any>>({})

// 步骤1数据
const form = ref({
  name: '',
  idCardNo: '',
  idFront: '',
  idBack: '',
  bankImg: '',
  cardNumber: '',
  idFrontFileUrl: '',
  idBackFileUrl: '',
  bankCardFileUrl: '',
})

// 步骤2数据
const signatureImage = ref('') // 乙方签名
const partyASignatureImage = ref('') // 甲方签名
const isSigningForPartyA = ref(false) // 当前是否在为甲方签名
const contractUrl = ref('') // 合同URL

// 合同表单数据
const serviceProviderOptions = ['服务委托方A', '服务委托方B', '服务委托方C']
const contractForm = ref({
  contractName: '',          // 合同名称
  fileLists: [] as { fileName: string, fileUrl: string }[], // 文件列表
  installmentCount: '',       // 支付分期数量
  perAmount: '',             // 每期支付金额
  bankName: '',              // 银行开户银行
  publicityMonths: '',        // 自愿宣传期数(月)
  recommendCount: '',        // 推荐客户数量
  firstRepaymentDate: '',    // 首次还款日期
  serviceProviderIndex: 0,   // 服务委托方索引
  doctorSign: '',            // 医生签名
  signAddr: '',              // 签约地址
})

// 签字相关
const showSignPad = ref(false)
const isDrawing = ref(false)
const hasSigned = ref(false)
const lastPoint = ref({ x: 0, y: 0 })
const canvasRect = ref({ left: 0, top: 0 })
let signCtx: UniApp.CanvasContext | null = null
const proxy = getCurrentInstance()?.proxy as any

// 实名认证完成后回调
let pendingContractId: string | null = null

// 处理实名认证完成
async function handleVerificationComplete(contractId: string) {
  if (!contractId) {
    uni.showToast({ title: '缺少合同ID', icon: 'none' })
    isProcessingReturn = false
    return
  }

  uni.showLoading({ title: '验证中...' })
  try {
    // 调用乙方签署预览
    const partyBUrl = await paasV2PartyBSign(contractId)
    console.log('partyBUrl', partyBUrl)
    if (partyBUrl) {
      // 保存状态并打开乙方签署页面
      sessionStorage.setItem('pendingContractId', contractId)
      sessionStorage.setItem('pendingAction', 'partyB')
      // 重置标志
      isProcessingReturn = false
      // 使用 replace 避免历史记录问题
      window.location.replace(partyBUrl)
      return
    }

    // 如果没有返回URL，进入下一步
    isProcessingReturn = false
    currentStep.value = 3
  }
  catch {
    isProcessingReturn = false
    uni.showToast({ title: '验证失败', icon: 'none' })
  }
  finally {
    uni.hideLoading()
  }
}

// 处理乙方签署完成
async function handlePartyBSignComplete(contractId: string) {
  console.log('handlePartyBSignComplete called, contractId:', contractId)
  if (!contractId) {
    uni.showToast({ title: '缺少合同ID', icon: 'none' })
    isProcessingReturn = false
    return
  }

  uni.showLoading({ title: '签署中...' })
  try {
    // 调用甲方签署预览
    const partyAUrl = await paasV2PartyASign(contractId)
    console.log('partyAUrl', partyAUrl)
    if (partyAUrl) {
      // 保存状态并打开甲方签署页面
      sessionStorage.setItem('pendingContractId', contractId)
      sessionStorage.setItem('pendingAction', 'partyA')
      // 重置标志
      isProcessingReturn = false
      // 使用 href 跳转，用户可以返回
      window.location.href = partyAUrl
      return
    }
    else {
      console.log('partyAUrl is empty')
      isProcessingReturn = false
    }
  }
  catch (err) {
    console.error('handlePartyBSignComplete error:', err)
    isProcessingReturn = false
    uni.showToast({ title: '签署失败', icon: 'none' })
  }
  finally {
    uni.hideLoading()
  }
}

// 处理甲方签署完成
async function handlePartyASignComplete(contractId: string) {
  if (!contractId) {
    uni.showToast({ title: '缺少合同ID', icon: 'none' })
    isProcessingReturn = false
    return
  }

  // 甲方签署完成，跳转到BasicInfo页面
  uni.showToast({ title: '签署完成', icon: 'success' })
  isProcessingReturn = false
  setTimeout(() => {
    window.location.href = '/pages/BasicInfo/index'
  }, 800)
}

// 监听页面显示，检测签署流程是否完成
let isProcessingReturn = false

onMounted(() => {
  // 首次加载时检查状态
  setTimeout(() => {
    if (!isProcessingReturn) {
      handlePageReturn()
    }
  }, 100)
})

// #ifdef H5
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // 页面从 bfcache 恢复
    setTimeout(() => {
      if (!isProcessingReturn) {
        handlePageReturn()
      }
    }, 100)
  }
})
// #endif

function handlePageReturn() {
  // 每次都强制重置
  isProcessingReturn = false

  const contractId = sessionStorage.getItem('pendingContractId') || ''
  const action = sessionStorage.getItem('pendingAction') || ''
  console.log('handlePageReturn called, contractId:', contractId, 'action:', action)

  if (!contractId || !action) {
    console.log('handlePageReturn early return')
    return
  }

  // 标记为处理中，防止重复触发
  isProcessingReturn = true

  // 清除状态
  sessionStorage.removeItem('pendingContractId')
  sessionStorage.removeItem('pendingAction')

  if (action === 'verify') {
    // 从实名认证页面返回，调用乙方签署
    handleVerificationComplete(contractId)
  }
  else if (action === 'partyB') {
    // 从乙方签署页面返回，调用甲方签署
    handlePartyBSignComplete(contractId)
  }
  else if (action === 'partyA') {
    // 从甲方签署页面返回，签约完成
    handlePartyASignComplete(contractId)
  }
}

function initSignCanvas() {
  signCtx = uni.createCanvasContext('signCanvas', proxy)
  signCtx.setLineWidth(5)
  signCtx.setStrokeStyle('#111111')
  signCtx.setLineCap('round')
  signCtx.setLineJoin('round')
  signCtx.setFillStyle('#ffffff')
  signCtx.fillRect(0, 0, 9999, 9999)
  signCtx.draw()

  const q = uni.createSelectorQuery()
  if (proxy)
    q.in(proxy)
  q.select('#signCanvas').boundingClientRect((rect: any) => {
    if (rect)
      canvasRect.value = { left: rect.left || 0, top: rect.top || 0 }
  }).exec()
}

function getTouchPoint(e: any) {
  const t = e.touches?.[0] || e.changedTouches?.[0] || {}
  return {
    x: (t.clientX ?? t.pageX ?? t.x ?? 0) - canvasRect.value.left,
    y: (t.clientY ?? t.pageY ?? t.y ?? 0) - canvasRect.value.top,
  }
}

function onSignStart(e: any) {
  if (!signCtx)
    return
  isDrawing.value = true
  hasSigned.value = true
  lastPoint.value = getTouchPoint(e)

  // 点按也留痕
  signCtx.beginPath()
  signCtx.arc(lastPoint.value.x, lastPoint.value.y, 1.5, 0, 2 * Math.PI)
  signCtx.fill()
  signCtx.draw(true)
}

function onSignMove(e: any) {
  if (!signCtx || !isDrawing.value)
    return
  const p = getTouchPoint(e)
  signCtx.beginPath()
  signCtx.moveTo(lastPoint.value.x, lastPoint.value.y)
  signCtx.lineTo(p.x, p.y)
  signCtx.stroke()
  signCtx.draw(true)
  lastPoint.value = p
}

function onSignEnd() {
  isDrawing.value = false
}

function clearSign() {
  if (!signCtx)
    return
  hasSigned.value = false
  signCtx.setFillStyle('#ffffff')
  signCtx.fillRect(0, 0, 9999, 9999)
  signCtx.draw()
}

function cancelSign() {
  showSignPad.value = false
}

function confirmSign() {
  if (!hasSigned.value) {
    uni.showToast({ title: '请先签字', icon: 'none' })
    return
  }
  uni.canvasToTempFilePath(
    {
      canvasId: 'signCanvas',
      success: (res) => {
        if (isSigningForPartyA.value) {
          partyASignatureImage.value = res.tempFilePath
        }
        else {
          signatureImage.value = res.tempFilePath
        }
        showSignPad.value = false
      },
      fail: () => uni.showToast({ title: '签字保存失败', icon: 'none' }),
    },
    proxy,
  )
}

function handleSign() {
  isSigningForPartyA.value = false
  showSignPad.value = true
  nextTick(() => initSignCanvas())
}

function handlePartyASign() {
  isSigningForPartyA.value = true
  showSignPad.value = true
  nextTick(() => initSignCanvas())
}

// 步骤3数据
const verifyCode = ref('')
const livenessPassed = ref(true)
const isAgreed = ref(true)
const repaymentStatusOptions = ['未还款', '已还款', '逾期']

const extraForm = ref({
  wechatOpenid: '',
  repaymentStatus: 0,
  bankName: '',
  expireDate: '',
  repaymentDate: '',
  invitePerson: '',
  inviteName: '',
  signDate: '',
  startDate: '',
  endDate: '',
})

const canPartyASubmit = computed(() => {
  return partyASignatureImage.value && isAgreed.value
})

const maskedPhone = computed(() => {
  const raw = (basicDraft.value.phone || '').toString()
  if (raw.length < 7)
    return raw || '未填写'
  return `${raw.slice(0, 3)}****${raw.slice(-4)}`
})

// OCR API
const OCR_API = {
  idFront: '/customer/customerInfo/ocr/idCardFront',
  idBack: '/customer/customerInfo/ocr/idCardBack',
  bankCard: '/customer/customerInfo/ocr/bankCard',
} as const

function parseUploadData(uploadRes: any) {
  let data: any = uploadRes?.data
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    }
    catch {
      data = {}
    }
  }
  return data || {}
}

function doOCR(type: 'idFront' | 'idBack' | 'bankCard', filePath: string) {
  uni.showLoading({ title: '识别中...' })
  uni.uploadFile({
    url: OCR_API[type],
    filePath,
    name: 'file',
    success: (uploadRes: any) => {
      const data = parseUploadData(uploadRes)
      const ok = uploadRes?.statusCode === 200 && (data?.code === 200 || data?.code === 0 || data?.success === true)
      if (!ok) {
        uni.showToast({ title: data?.message || '识别失败', icon: 'none' })
        return
      }

      const result = data?.data || {}
      if (type === 'idFront') {
        form.value.name = result.name || form.value.name
        form.value.idCardNo = result.idCardNo || result.idCard || result.idNo || result.number || form.value.idCardNo
        form.value.idFrontFileUrl = result.fileUrl || form.value.idFrontFileUrl
      }
      else if (type === 'idBack') {
        form.value.idBackFileUrl = result.fileUrl || form.value.idBackFileUrl
      }
      else if (type === 'bankCard') {
        form.value.cardNumber = result.cardNumber || result.bankNo || result.cardNo || result.number || form.value.cardNumber
        form.value.bankCardFileUrl = result.fileUrl || form.value.bankCardFileUrl
      }

      uni.showToast({ title: '识别成功', icon: 'success' })
    },
    fail: () => {
      uni.showToast({ title: 'OCR请求失败', icon: 'none' })
    },
    complete: () => {
      uni.hideLoading()
    },
  })
}

// 图片选择与OCR
function chooseImage(type: 'idFront' | 'idBack' | 'bankCard') {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      const filePath = res.tempFilePaths[0]
      if (!filePath)
        return

      if (type === 'idFront') {
        form.value.idFront = filePath
      }
      else if (type === 'idBack') {
        form.value.idBack = filePath
      }
      else {
        form.value.bankImg = filePath
      }

      doOCR(type, filePath)
    },
  })
}

async function nextStep() {
  if (currentStep.value === 1) {
    // 步骤1: 信息补充
    if (!basicDraft.value.name || !basicDraft.value.phone) {
      uni.showToast({ title: '请完善基本信息', icon: 'none' })
      return
    }
    currentStep.value = 2
  }
  else if (currentStep.value === 2) {
    // 步骤2: 合同信息补充 - 先添加客户信息，再创建合同
    if (!contractForm.value.contractName) {
      uni.showToast({ title: '请输入合同名称', icon: 'none' })
      return
    }

    // 构建客户信息 payload
    const customerPayload = {
      // 客户基本信息
      name: basicDraft.value.name || form.value.name || '',
      customerName: basicDraft.value.name || form.value.name || '',
      sex: Number(basicDraft.value.sex) || 1,
      age: Number(basicDraft.value.age) || 0,
      phone: basicDraft.value.phone || '',
      idCard: basicDraft.value.idCard || form.value.idCardNo || '',
      idCardFrontUrl: basicDraft.value.idCardFrontUrl || form.value.idFrontFileUrl || '',
      idCardBackUrl: form.value.idBackFileUrl || '',
      email: basicDraft.value.email || '',
      wechatOpenid: extraForm.value.wechatOpenid || '',
      address: basicDraft.value.address || '',

      // 合同信息
      contractName: contractForm.value.contractName,
      contractAmount: Number(contractDraft.value.contractAmount) || 0,
      contractType: contractDraft.value.configCode || '',
      operationFee: contractDraft.value.operationFee || 0,
      serviceFee: contractDraft.value.serviceFee || 0,
      signDate: extraForm.value.signDate || '',
      signAddr: contractForm.value.signAddr || '',
      startDate: extraForm.value.startDate || '',
      endDate: extraForm.value.endDate || '',

      // 宣传信息
      compaignPeriod: Number(contractForm.value.publicityMonths) || 0,
      recomAmount: Number(contractForm.value.recommendCount) || 0,

      // 还款信息
      period: Number(contractForm.value.installmentCount) || 0,
      installment: Number(contractForm.value.perAmount) || 0,
      repaymentDay: Number(contractForm.value.firstRepaymentDate?.split('-')[2]) || 0,
      repaymentDate: extraForm.value.repaymentDate || '',
      firstRepaymentDate: contractForm.value.firstRepaymentDate || '',

      // 银行卡信息
      bankCardNo: form.value.cardNumber || '',
      bankName: contractForm.value.bankName || '',
      bankCardUrl: form.value.bankCardFileUrl || '',
      expireDate: extraForm.value.expireDate || '',

      // 邀请信息
      inviteCode: basicDraft.value.inviteCode || '',
      invitePerson: extraForm.value.invitePerson || '',
      inviteName: extraForm.value.inviteName || '',

      // 服务委托方
      designatedOrg: serviceProviderOptions[contractForm.value.serviceProviderIndex],

      // 医生签名
      doctorName: contractForm.value.doctorSign || '',
    }

    uni.showLoading({ title: '提交中...' })
    try {
      // 1. 先添加客户信息，获取 customerCode
      const addRes = await addCustomer(customerPayload)
      console.log(addRes)
      const customerCode = addRes || ''

      // 2. 生成牙科合同
      if (customerCode) {
        await generateDentalContract(customerCode)
      }

      // 3. 生成推荐合同
      if (customerCode) {
        await generateRecommendContract(customerCode)
      }

      // 4. 添加成功后创建合同
      const createRes = await paasV2CreateContract({
        customerCode: customerCode,
        contractName: contractForm.value.contractName
      })
      const certificationUrl = createRes?.certificationUrl || ''
      const contractId = createRes?.contractId || ''

      // 保存合同ID
      contractDraft.value = {
        ...contractDraft.value,
        contractId: contractId,
      }
      uni.setStorageSync('customer-contract-draft', contractDraft.value)

      // 5. 打开实名认证页面
      if (certificationUrl) {
        uni.hideLoading()
        pendingContractId = contractId
        sessionStorage.setItem('pendingContractId', contractId)
        sessionStorage.setItem('pendingAction', 'verify')
        uni.showModal({
          title: '实名认证',
          content: '即将打开实名认证页面，完成认证后返回继续签约',
          confirmText: '去认证',
          success: (modalRes) => {
            if (modalRes.confirm) {
              window.location.href = certificationUrl
            }
            else {
              pendingContractId = null
              sessionStorage.removeItem('pendingContractId')
              sessionStorage.removeItem('pendingAction')
            }
          },
        })
        return
      }

      // 保存合同数据
      contractDraft.value = {
        ...contractDraft.value,
        contractName: contractForm.value.contractName,
        fileLists: contractForm.value.fileLists,
        installmentCount: contractForm.value.installmentCount,
        perAmount: contractForm.value.perAmount,
        bankName: contractForm.value.bankName,
        publicityMonths: contractForm.value.publicityMonths,
        recommendCount: contractForm.value.recommendCount,
        firstRepaymentDate: contractForm.value.firstRepaymentDate,
        serviceProvider: serviceProviderOptions[contractForm.value.serviceProviderIndex],
        doctorSign: contractForm.value.doctorSign,
        signAddr: contractForm.value.signAddr,
      }
      uni.setStorageSync('customer-contract-draft', contractDraft.value)
      currentStep.value = 3
    }
    catch {
      uni.showToast({ title: '提交失败', icon: 'none' })
    }
    finally {
      uni.hideLoading()
    }
  }
  else if (currentStep.value === 3) {
    // 步骤3: 乙方签署
    if (!signatureImage.value) {
      uni.showToast({ title: '请完成乙方签名', icon: 'none' })
      return
    }
    // 获取合同ID并调用乙方签署
    const contractId = contractDraft.value.contractId || ''
    if (contractId) {
      handlePartyBSignComplete(contractId)
    }
    else {
      uni.showToast({ title: '缺少合同ID', icon: 'none' })
    }
  }
  else if (currentStep.value === 4) {
    // 步骤4: 甲方签署完成，跳转到BasicInfo
    const contractId = contractDraft.value.contractId || ''
    if (contractId) {
      handlePartyASignComplete(contractId)
    }
    else {
      uni.showToast({ title: '缺少合同ID', icon: 'none' })
    }
  }
}

// 获取验证码
function getVerifyCode() {
  uni.showToast({ title: '验证码已发送', icon: 'none' })
}

// 活体检测
const LIVENESS_API = '/customer/customerInfo/liveness/check'

function startLivenessCheck() {
  uni.chooseVideo({
    sourceType: ['camera'],
    maxDuration: 10,
    camera: 'front',
    success: (res) => {
      const videoPath = res.tempFilePath
      if (!videoPath) {
        uni.showToast({ title: '未获取到视频', icon: 'none' })
        return
      }

      uni.showLoading({ title: '活体检测中...' })

      uni.uploadFile({
        url: LIVENESS_API,
        filePath: videoPath,
        name: 'video',
        success: (uploadRes: any) => {
          const data = parseUploadData(uploadRes)
          const ok = uploadRes?.statusCode === 200 && (data?.code === 200 || data?.code === 0 || data?.success === true)

          if (!ok) {
            uni.showToast({ title: data?.message || '检测失败，请重试', icon: 'none' })
            return
          }

          const result = data?.data || {}
          const passed = result.passed === true || result.success === true || result.status === 'pass'

          if (passed) {
            livenessPassed.value = true
            uni.showToast({ title: '活体检测通过', icon: 'success' })
          }
          else {
            uni.showToast({ title: result.message || '检测未通过，请重试', icon: 'none' })
          }
        },
        fail: () => {
          uni.showToast({ title: '检测请求失败', icon: 'none' })
        },
        complete: () => {
          uni.hideLoading()
        },
      })
    },
    fail: () => {
      uni.showToast({ title: '录制取消', icon: 'none' })
    },
  })
}

function onAgreementChange(e: any) {
  isAgreed.value = e.detail.value.length > 0
}

function onRepaymentStatusChange(e: any) {
  extraForm.value.repaymentStatus = Number(e.detail.value)
}

function onFirstRepaymentDateChange(e: any) {
  contractForm.value.firstRepaymentDate = e.detail.value
}

function onServiceProviderChange(e: any) {
  contractForm.value.serviceProviderIndex = Number(e.detail.value)
}

function normalizeDateTime(dateStr?: string) {
  if (!dateStr)
    return ''
  return `${dateStr} 00:00:00`
}

function toDateValue(value?: string) {
  if (!value)
    return ''
  return value.split(' ')[0]
}

function onDateTimeChange(field: 'expireDate' | 'repaymentDate' | 'signDate' | 'startDate' | 'endDate', e: any) {
  extraForm.value[field] = normalizeDateTime(e?.detail?.value || '')
}

async function submitAll() {
  // addCustomer 已在步骤2调用
  uni.showToast({ title: '签约完成', icon: 'success' })
  uni.removeStorageSync('customer-basic-draft')
  uni.removeStorageSync('customer-contract-draft')
  setTimeout(() => {
    uni.redirectTo({
      url: '/pages/Repayment/index',
    })
  }, 800)
}

function goBack() {
  uni.navigateBack()
}

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 44

  basicDraft.value = uni.getStorageSync('customer-basic-draft') || {}
  contractDraft.value = uni.getStorageSync('customer-contract-draft') || {}

  form.value.name = basicDraft.value.name || form.value.name
  form.value.idCardNo = basicDraft.value.idCard || form.value.idCardNo

  // 恢复合同表单数据
  if (contractDraft.value.installmentCount) {
    contractForm.value.contractName = contractDraft.value.contractName || ''
    contractForm.value.fileLists = contractDraft.value.fileLists || []
    contractForm.value.installmentCount = contractDraft.value.installmentCount
    contractForm.value.perAmount = contractDraft.value.perAmount
    contractForm.value.bankName = contractDraft.value.bankName
    contractForm.value.publicityMonths = contractDraft.value.publicityMonths
    contractForm.value.recommendCount = contractDraft.value.recommendCount
    contractForm.value.firstRepaymentDate = contractDraft.value.firstRepaymentDate
    const providerIndex = serviceProviderOptions.indexOf(contractDraft.value.serviceProvider || '')
    contractForm.value.serviceProviderIndex = providerIndex > -1 ? providerIndex : 0
    contractForm.value.doctorSign = contractDraft.value.doctorSign || ''
    contractForm.value.signAddr = contractDraft.value.signAddr || ''
  }

  if (!basicDraft.value.name || !basicDraft.value.phone) {
    uni.showToast({ title: '请先填写基础信息', icon: 'none' })
    setTimeout(() => {
      uni.redirectTo({
        url: '/pages/BasicInfo/index',
      })
    }, 500)
  }
})
</script>

<style lang="scss" scoped>
.process-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 40rpx;
}

.custom-navbar {
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

  .navbar-content {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
  }

  .navbar-back {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;

    .back-icon {
      font-size: 32px;
      color: #333;
      font-weight: bold;
    }
  }

  .navbar-title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: #333;
  }

  .navbar-placeholder {
    width: 44px;
  }
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

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
  padding-left: 8rpx;
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

/* 签字弹层优化 */
.sign-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: flex-end;
  z-index: 999;
}

.sign-panel {
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border-radius: 24rpx 24rpx 0 0;
  padding: 20rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -12rpx 40rpx rgba(0, 0, 0, 0.12);
}

.sign-title {
  position: relative;
  text-align: center;
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2937;
  margin: 14rpx 0 20rpx;

  &::before {
    content: '';
    position: absolute;
    top: -12rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 88rpx;
    height: 8rpx;
    border-radius: 999rpx;
    background: #d1d5db;
  }
}

.sign-canvas {
  width: 100%;
  height: 420rpx;
  border-radius: 16rpx;
  border: 3rpx solid #4b5563;
  background-color: #fff;
  background-image:
    linear-gradient(to right, rgba(148, 163, 184, 0.15) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.15) 1px, transparent 1px);
  background-size: 24rpx 24rpx;
  box-shadow:
    inset 0 0 0 2rpx #e5e7eb,
    0 8rpx 20rpx rgba(2, 6, 23, 0.08);
}

.sign-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 22rpx;
}

.sign-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  border-radius: 12rpx;
  border: 2rpx solid #d1d5db;
  background: #fff;
  color: #4b5563;
}

.sign-btn.primary {
  border: none;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  box-shadow: 0 8rpx 20rpx rgba(37, 99, 235, 0.35);
}
</style>
