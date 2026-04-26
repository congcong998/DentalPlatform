<!-- filepath: d:\PartTimeJob\DentalPlatformJob\DentalPlatform\src\pages\basic-info\index.vue -->
<template>
  <view class="basic-info-container">
    <view class="info-content">
      <view class="info-section">
        <view class="section-title">
          个人信息
        </view>
        <view class="info-grid">
          <view class="info-item">
            <text class="item-label">姓名</text>
            <input v-model="name" class="item-input" type="text" placeholder="请输入姓名">
          </view>
          <view class="info-item">
            <text class="item-label">性别</text>
            <picker mode="selector" :range="genderOptions" :value="genderIndex" @change="onGenderChange">
              <view class="picker-text" :class="{ 'has-value': genderIndex !== -1 }">
                {{ genderIndex !== -1 ? genderOptions[genderIndex] : '请选择性别' }}
              </view>
            </picker>
          </view>
          <view class="info-item">
            <text class="item-label">年龄</text>
            <input v-model="age" class="item-input" type="number" placeholder="请输入年龄">
          </view>
          <view class="info-item">
            <text class="item-label">电话</text>
            <input v-model="phone" class="item-input" type="tel" placeholder="请输入电话号码">
          </view>
          <view class="info-item">
            <text class="item-label">证件号</text>
            <view class="id-card-row">
              <input v-model="idCard" class="item-input" type="idcard" placeholder="请输入身份证号">
              <view class="ocr-btn" @click="handleOCR">
                OCR识别
              </view>
            </view>
          </view>
          <view class="info-item">
            <text class="item-label">邮箱地址</text>
            <input v-model="email" class="item-input" type="text" placeholder="请输入邮箱地址">
          </view>
          <view class="info-item">
            <text class="item-label">推荐码</text>
            <input v-model="inviteCode" class="item-input" type="text" placeholder="请输入推荐码（可选）">
          </view>
        </view>
      </view>

      <view class="info-section">
        <view class="section-title">
          地址信息
        </view>
        <view class="info-grid">
          <view class="info-item">
            <text class="item-label">省份</text>
            <picker mode="selector" :range="provinceOptions" :value="provinceIndex" @change="onProvinceChange">
              <view class="picker-text" :class="{ 'has-value': provinceIndex !== -1 }">
                {{ provinceIndex !== -1 ? provinceOptions[provinceIndex] : '请选择省份' }}
              </view>
            </picker>
          </view>
          <view class="info-item">
            <text class="item-label">城市</text>
            <picker
              mode="selector" :range="cityOptions" :value="cityIndex" :disabled="provinceIndex === -1"
              @change="onCityChange"
            >
              <view class="picker-text" :class="{ 'has-value': cityIndex !== -1, 'disabled': provinceIndex === -1 }">
                {{ cityIndex !== -1 ? cityOptions[cityIndex] : '请选择城市' }}
              </view>
            </picker>
          </view>
          <view class="info-item">
            <text class="item-label">区县</text>
            <picker
              mode="selector" :range="districtOptions" :value="districtIndex" :disabled="cityIndex === -1"
              @change="onDistrictChange"
            >
              <view class="picker-text" :class="{ 'has-value': districtIndex !== -1, 'disabled': cityIndex === -1 }">
                {{ districtIndex !== -1 ? districtOptions[districtIndex] : '请选择区县' }}
              </view>
            </picker>
          </view>
          <view class="info-item full-width">
            <text class="item-label">详细地址</text>
            <textarea v-model="detailAddress" class="item-textarea" placeholder="请输入详细地址" />
          </view>
        </view>
      </view>

      <view class="action-buttons">
        <button class="btn btn-cancel" @click="handleCancel">
          取消
        </button>
        <button class="btn btn-submit" @click="handleSubmit">
          提交
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import areaData from './areaData' // 将省市区数据导入

definePage({
  // #ifdef H5
  type: 'home',
  // #endif
  style: {
    navigationBarTitleText: '基础信息',
  },
})

const genderOptions = ['男', '女']
const genderIndex = ref(-1)

// 身份证号
const idCard = ref('')
const idCardFrontFileUrl = ref('')

// 省市区数据
const provinceOptions = ref<string[]>([])
const provinceIndex = ref(-1)

const cityOptions = ref<string[]>([])
const cityIndex = ref(-1)

const districtOptions = ref<string[]>([])
const districtIndex = ref(-1)

// 表单字段
const name = ref('')
const age = ref('')
const phone = ref('')
const email = ref('')
const inviteCode = ref('')
const detailAddress = ref('')

// 存储完整的数据结构
const areaFullData = ref(areaData)

// 初始化省份列表
provinceOptions.value = areaFullData.value.map(item => item.name)

// 设置默认省市
onMounted(() => {
  // 查找山东省的索引
  const shandongIndex = areaFullData.value.findIndex(item => item.name === '山东省')
  if (shandongIndex !== -1) {
    provinceIndex.value = shandongIndex
    const province = areaFullData.value[shandongIndex]
    cityOptions.value = province.children?.map(item => item.name) || []

    // 查找青岛市的索引
    const qingdaoIndex = province.children?.findIndex(item => item.name === '青岛市')
    if (qingdaoIndex !== undefined && qingdaoIndex !== -1) {
      cityIndex.value = qingdaoIndex
      const city = province.children?.[qingdaoIndex]
      districtOptions.value = city?.children?.map(item => item.name) || []
    }
  }
})

function onGenderChange(e: any) {
  genderIndex.value = e.detail.value
}

function onProvinceChange(e: any) {
  provinceIndex.value = e.detail.value
  // 重置城市和区县
  cityIndex.value = -1
  districtIndex.value = -1
  districtOptions.value = []

  // 加载对应的城市数据
  const province = areaFullData.value[provinceIndex.value]
  cityOptions.value = province.children?.map(item => item.name) || []
}

function onCityChange(e: any) {
  cityIndex.value = e.detail.value
  // 重置区县
  districtIndex.value = -1

  // 加载对应的区县数据
  const province = areaFullData.value[provinceIndex.value]
  const city = province.children?.[cityIndex.value]
  districtOptions.value = city?.children?.map(item => item.name) || []
}

function onDistrictChange(e: any) {
  districtIndex.value = e.detail.value
}

// 办理OCR识别
const OCR_ID_CARD_FRONT_API = '/customer/customerInfo/ocr/idCardFront'

function parseUploadData(uploadRes: any) {
  const raw = uploadRes?.data
  if (!raw)
    return {}
  if (typeof raw === 'object')
    return raw
  if (typeof raw === 'string') {
    const text = raw.trim()
    if (!text)
      return {}
    try {
      return JSON.parse(text)
    }
    catch {
      return {}
    }
  }
  return {}
}

function handleOCR() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success: (res) => {
      const filePath = res.tempFilePaths?.[0]
      if (!filePath) {
        uni.showToast({ title: '未获取到图片', icon: 'none' })
        return
      }

      uni.showLoading({ title: '智能识别中...' })

      uni.uploadFile({
        url: OCR_ID_CARD_FRONT_API,
        filePath,
        name: 'file',
        success: (uploadRes: any) => {
          const data: any = parseUploadData(uploadRes)

          const ok = uploadRes?.statusCode === 200
            && (data?.code === 200 || data?.code === 0 || data?.success === true)

          if (!ok) {
            uni.showToast({ title: data?.message || '识别失败', icon: 'none' })
            return
          }

          const result = data?.data || {}
          const ocrName = result.name || ''
          const idNo = result.idCardNo || result.idCard || result.idNo || result.number || result.num || ''
          const fileUrl = result.fileUrl || ''

          if (ocrName && !name.value.trim())
            name.value = ocrName
          if (idNo)
            idCard.value = idNo
          if (fileUrl)
            idCardFrontFileUrl.value = fileUrl

          if (!idNo) {
            uni.showToast({ title: '未识别到身份证号', icon: 'none' })
            return
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
    },
  })
}

function handleCancel() {
  uni.navigateBack()
}

function handleSubmit() {
  if (!name.value.trim()) {
    uni.showToast({ title: '请输入姓名', icon: 'none' })
    return
  }
  if (!phone.value.trim()) {
    uni.showToast({ title: '请输入电话号码', icon: 'none' })
    return
  }

  const province = provinceIndex.value !== -1 ? provinceOptions.value[provinceIndex.value] : ''
  const city = cityIndex.value !== -1 ? cityOptions.value[cityIndex.value] : ''
  const district = districtIndex.value !== -1 ? districtOptions.value[districtIndex.value] : ''
  const sex = genderIndex.value !== -1 ? genderIndex.value + 1 : undefined

  const draft = {
    name: name.value.trim(),
    sex,
    age: age.value ? Number(age.value) : undefined,
    phone: phone.value.trim(),
    idCard: idCard.value.trim(),
    idCardFrontUrl: idCardFrontFileUrl.value,
    email: email.value.trim(),
    inviteCode: inviteCode.value.trim(),
    province,
    city,
    district,
    detailAddress: detailAddress.value.trim(),
    address: `${province}${city}${district}${detailAddress.value.trim()}`,
  }

  uni.setStorageSync('customer-basic-draft', draft)
  uni.showToast({ title: '已保存，继续下一步', icon: 'success' })
  setTimeout(() => {
    uni.navigateTo({
      url: '/pages/Product/index',
    })
  }, 400)
}
</script>

<style lang="scss" scoped>
.basic-info-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  box-sizing: border-box;
}

.info-header {
  background: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

  .header-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
}

.info-content {
  .info-section {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 30rpx;
      padding-bottom: 20rpx;
      border-bottom: 2rpx solid #f0f0f0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 30rpx;

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 15rpx;

        &.full-width {
          grid-column: 1 / -1;
        }

        .item-label {
          font-size: 28rpx;
          color: #666;
          font-weight: 500;
        }

        .id-card-row {
          display: flex;
          align-items: stretch;
          gap: 20rpx;

          .item-input {
            flex: 1;
            width: auto;
          }

          .ocr-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 30rpx;
            background: #e6f7ff;
            color: #1890ff;
            font-size: 26rpx;
            border-radius: 8rpx;
            border: 2rpx solid #91d5ff;
            white-space: nowrap;
            transition: all 0.3s;

            &:active {
              background: #bae7ff;
            }
          }
        }

        .item-input,
        .item-textarea {
          padding: 20rpx;
          background: #f8f8f8;
          border-radius: 8rpx;
          font-size: 28rpx;
          border: 2rpx solid transparent;
          transition: all 0.3s;

          &:focus {
            background: #fff;
            border-color: #1890ff;
          }
        }

        .item-textarea {
          min-height: 150rpx;
        }

        .picker-text {
          padding: 20rpx;
          background: #f8f8f8;
          border-radius: 8rpx;
          font-size: 28rpx;
          color: #999;
          min-height: 42rpx;
          line-height: 42rpx;
          display: flex;
          align-items: center;

          &.has-value {
            color: #333;
          }

          &.disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 20rpx;
    padding: 30rpx 0;

    .btn {
      flex: 1;
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 44rpx;
      font-size: 32rpx;
      border: none;

      &.btn-cancel {
        background: #fff;
        color: #666;
        border: 2rpx solid #d9d9d9;
      }

      &.btn-submit {
        background: linear-gradient(135deg, #1890ff, #096dd9);
        color: #fff;
      }
    }
  }
}

// 平板适配（宽度大于768px）
@media (min-width: 768px) {
  .basic-info-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40rpx;
  }

  .info-header {
    padding: 50rpx;

    .header-title {
      font-size: 48rpx;
    }
  }

  .info-content {
    .info-section {
      padding: 50rpx;

      .section-title {
        font-size: 40rpx;
      }

      .info-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 40rpx;
      }
    }

    .action-buttons {
      max-width: 600rpx;
      margin: 0 auto;
      padding: 50rpx 0;

      .btn {
        height: 100rpx;
        line-height: 100rpx;
        font-size: 36rpx;
      }
    }
  }
}

// 大屏适配（宽度大于1024px）
@media (min-width: 1024px) {
  .basic-info-container {
    max-width: 1400px;
  }

  .info-content {
    .info-section {
      .info-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }
}
</style>
