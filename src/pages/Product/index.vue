<!-- filepath: d:\PartTimeJob\DentalPlatformJob\DentalPlatform\src\pages\Product\index.vue -->
<template>
  <view class="product-container">
    <view class="product-content">
      <!-- 服务内容 -->
      <view class="service-section">
        <view class="section-title">
          服务内容
        </view>
        <view class="service-list">
          <view v-for="(service, index) in services" :key="index" class="service-item">
            <view class="service-icon">
              {{ service.icon }}
            </view>
            <view class="service-info">
              <text class="service-name">{{ service.name }}</text>
              <text class="service-desc">{{ service.description }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 价格选择 -->
      <view class="price-section">
        <view class="section-title">
          选择套餐
        </view>
        <view class="price-list">
          <view
            v-for="(price, index) in priceOptions" :key="index" class="price-card"
            :class="{ selected: selectedPriceIndex === index }" @click="selectPrice(index)"
          >
            <!-- 标签居中 -->
            <view v-if="price.tag" class="price-tag-center">
              {{ price.tag }}
            </view>
            <view class="price-header">
              <text class="price-name">{{ price.name }}</text>
            </view>
            <view class="price-amount">
              <text class="price-symbol">¥</text>
              <text class="price-value">{{ price.price }}</text>
              <text class="price-unit">/{{ price.unit }}</text>
            </view>
            <view class="contract-info">
              <text class="contract-label">合同类型：</text>
              <text class="contract-type">{{ price.contractType }}</text>
            </view>
            <view class="price-features">
              <view v-for="(feature, fIndex) in price.features" :key="fIndex" class="feature-item">
                <text class="feature-icon">✓</text>
                <text class="feature-text">{{ feature }}</text>
              </view>
            </view>
            <!-- 选中按钮绝对定位 -->
            <view class="select-indicator-abs">
              <view v-if="selectedPriceIndex === index" class="selected-icon">
                ✓
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="btn btn-cancel" @click="handleCancel">
          取消
        </button>
        <button class="btn btn-confirm" :disabled="selectedPriceIndex === -1" @click="handleConfirm">
          确认选择
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '服务套餐',
  },
})

// 服务内容
const services = ref([
  {
    icon: '🦷',
    name: '口腔检查',
    description: '全面的口腔健康检查与评估',
  },
  {
    icon: '🔬',
    name: '专业洁牙',
    description: '超声波洁牙，去除牙结石',
  },
  {
    icon: '💊',
    name: '治疗方案',
    description: '个性化口腔治疗方案制定',
  },
  {
    icon: '📋',
    name: '健康档案',
    description: '建立完整的口腔健康档案',
  },
])

// 价格选项
const priceOptions = ref([
  {
    name: '基础版',
    price: '999',
    unit: '年',
    tag: '',
    contractType: '基础服务合同',
    features: ['基础口腔检查', '洁牙服务1次/年', '健康咨询', '电子档案'],
  },
  {
    name: '标准版',
    price: '1999',
    unit: '年',
    tag: '推荐',
    contractType: '标准服务合同',
    features: [
      '全面口腔检查',
      '洁牙服务2次/年',
      '专家咨询',
      '优先预约',
      '健康档案',
      '定期提醒',
    ],
  },
  {
    name: '高级版',
    price: '3999',
    unit: '年',
    tag: '热门',
    contractType: '高级服务合同',
    features: [
      '深度口腔检查',
      '洁牙服务4次/年',
      '专家一对一',
      'VIP预约通道',
      '完整健康档案',
      '智能提醒',
      '家庭共享',
    ],
  },
  {
    name: '尊享版',
    price: '6999',
    unit: '年',
    tag: 'VIP',
    contractType: '尊享服务合同',
    features: [
      '全方位口腔检查',
      '不限次数洁牙',
      '首席专家服务',
      '绿色就诊通道',
      '终身健康档案',
      '专属健康管家',
      '全家庭服务',
      '紧急预约',
    ],
  },
])

const selectedPriceIndex = ref(-1)

function selectPrice(index: number) {
  selectedPriceIndex.value = index
}

function handleCancel() {
  uni.navigateBack()
}

function handleConfirm() {
  if (selectedPriceIndex.value === -1) {
    uni.showToast({
      title: '请选择套餐',
      icon: 'none',
    })
    return
  }

  const selectedPrice = priceOptions.value[selectedPriceIndex.value]
  uni.showModal({
    title: '确认选择',
    content: `您选择了${selectedPrice.name}套餐，价格：¥${selectedPrice.price}/${selectedPrice.unit}`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '选择成功',
          icon: 'success',
        })
        // 这里可以进行后续操作，如跳转到合同页面
      }
    },
  })
}
</script>

<style lang="scss" scoped>
.product-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
  box-sizing: border-box;
}

.product-content {
  .service-section,
  .price-section {
    background: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  }

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #f0f0f0;
  }

  .service-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20rpx;

    .service-item {
      display: flex;
      align-items: center;
      padding: 20rpx;
      background: #f8f8f8;
      border-radius: 8rpx;
      gap: 20rpx;

      .service-icon {
        font-size: 48rpx;
        width: 80rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 50%;
      }

      .service-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .service-name {
          font-size: 28rpx;
          font-weight: 600;
          color: #333;
        }

        .service-desc {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .price-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20rpx;

    .price-card {
      position: relative;
      padding: 36rpx 30rpx 30rpx 30rpx;
      background: #fff;
      border-radius: 18rpx;
      border: 3rpx solid transparent;
      box-shadow:
        0 4rpx 24rpx 0 rgba(24, 144, 255, 0.08),
        0 1rpx 2rpx 0 rgba(0, 0, 0, 0.04);
      transition:
        box-shadow 0.25s,
        border-color 0.25s,
        transform 0.18s;
      cursor: pointer;
      overflow: visible;
      margin-top: 18rpx;

      &:hover,
      &:active {
        box-shadow:
          0 8rpx 32rpx 0 rgba(24, 144, 255, 0.16),
          0 2rpx 8rpx 0 rgba(0, 0, 0, 0.08);
        transform: translateY(-4rpx) scale(1.03);
        border-color: #91d5ff;
      }

      &.selected {
        background: linear-gradient(135deg, #e6f7ff 80%, #fff 100%);
        border-image: linear-gradient(135deg, #1890ff, #40a9ff) 1;
        border-width: 3rpx;
        border-style: solid;
        box-shadow:
          0 12rpx 36rpx 0 rgba(24, 144, 255, 0.18),
          0 2rpx 8rpx 0 rgba(0, 0, 0, 0.1);
        transform: translateY(-6rpx) scale(1.04);
      }

      .price-tag-center {
        position: absolute;
        top: -24rpx;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        padding: 8rpx 36rpx;
        background: linear-gradient(135deg, #1890ff 60%, #40a9ff 100%);
        color: #fff;
        font-size: 22rpx;
        border-radius: 32rpx;
        pointer-events: none;
        box-shadow: 0 4rpx 16rpx rgba(24, 144, 255, 0.12);
        font-weight: 700;
        letter-spacing: 3rpx;
        border: 2rpx solid #fff;
        text-shadow: 0 2rpx 8rpx rgba(24, 144, 255, 0.1);
      }

      .price-header {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 18rpx;

        .price-name {
          font-size: 36rpx;
          font-weight: 700;
          color: #1890ff;
          letter-spacing: 2rpx;
        }
      }

      .price-amount {
        display: flex;
        align-items: baseline;
        justify-content: center;
        margin-bottom: 18rpx;

        .price-symbol {
          font-size: 32rpx;
          color: #ff4d4f;
          font-weight: 600;
          margin-right: 2rpx;
        }

        .price-value {
          font-size: 60rpx;
          font-weight: bold;
          color: #ff4d4f;
          letter-spacing: 2rpx;
          margin: 0 2rpx;
          text-shadow: 0 2rpx 8rpx rgba(255, 77, 79, 0.08);
        }

        .price-unit {
          font-size: 26rpx;
          color: #999;
          margin-left: 8rpx;
        }
      }

      .contract-info {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12rpx 0;
        background: rgba(24, 144, 255, 0.06);
        border-radius: 8rpx;
        margin-bottom: 18rpx;

        .contract-label {
          font-size: 24rpx;
          color: #666;
        }

        .contract-type {
          font-size: 24rpx;
          color: #1890ff;
          font-weight: 600;
          margin-left: 8rpx;
        }
      }

      .price-features {
        display: flex;
        flex-direction: column;
        gap: 12rpx;
        margin-bottom: 10rpx;

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8rpx;

          .feature-icon {
            color: #52c41a;
            font-weight: bold;
            font-size: 22rpx;
          }

          .feature-text {
            font-size: 24rpx;
            color: #666;
          }
        }
      }

      .select-indicator-abs {
        position: absolute;
        top: 18rpx;
        right: 18rpx;
        width: 54rpx;
        height: 54rpx;
        border-radius: 50%;
        border: 3rpx solid #d9d9d9;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;
        background: #fff;
        transition: all 0.3s;
        box-shadow: 0 2rpx 8rpx rgba(24, 144, 255, 0.08);

        .selected-icon {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #1890ff, #40a9ff);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 32rpx;
          font-weight: bold;
          box-shadow: 0 2rpx 8rpx rgba(24, 144, 255, 0.1);
        }
      }

      &.selected .select-indicator-abs {
        border-color: #1890ff;
        box-shadow: 0 4rpx 16rpx rgba(24, 144, 255, 0.16);
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

      &.btn-confirm {
        background: linear-gradient(135deg, #1890ff, #096dd9);
        color: #fff;

        &:disabled {
          opacity: 0.5;
        }
      }
    }
  }
}

// 平板适配
@media (min-width: 768px) {
  .product-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40rpx;
  }

  .product-content {
    .service-list {
      grid-template-columns: repeat(2, 1fr);
    }

    .price-list {
      grid-template-columns: repeat(2, 1fr);
    }

    .action-buttons {
      max-width: 600rpx;
      margin: 0 auto;
    }
  }
}

// 大屏适配
@media (min-width: 1024px) {
  .product-container {
    max-width: 1400px;
  }

  .product-content {
    .service-list {
      grid-template-columns: repeat(4, 1fr);
    }

    .price-list {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
</style>
