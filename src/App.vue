<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { navigateToInterceptor } from '@/router/interceptor'
import { useUserStore } from '@/store/user'

onLaunch((options) => {
  console.log('App.vue onLaunch', options)

  // 检测登录状态
  checkLoginStatus()
})

onShow((options) => {
  console.log('App.vue onShow', options)
  // 处理直接进入页面路由的情况：如h5直接输入路由、微信小程序分享后进入等
  // https://github.com/unibest-tech/unibest/issues/192
  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})
onHide(() => {
  console.log('App Hide')
})

// 检测登录状态
function checkLoginStatus() {
  const userStore = useUserStore()
  const isLogin = !!userStore.userInfo?.userId

  // 获取当前页面路径
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const currentPath = currentPage ? `/${currentPage.route}` : ''

  // 白名单页面（不需要登录）
  const whiteList = [
    '/pages/login/index',
    '/pages/agreement/index',
    '/pages/about/index',
    '/pages/developing/index',
    // H5 页面
    '/pages/Process/index',
    '/pages/Product/index',
    '/pages/Repayment/index',
    '/pages/BasicInfo/index',
  ]

  // 未登录且不在白名单中，跳转到登录页
  if (!isLogin && !whiteList.includes(currentPath)) {
    uni.reLaunch({
      url: '/pages/login/index',
    })
  }
}
</script>

<style lang="scss">
/* 全局滚动条美化 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.25);
  }
}

/* 隐藏水平滚动条 */
::-webkit-scrollbar:horizontal {
  height: 0;
  display: none;
}

/* uni-app scroll-view 滚动条 */
:deep(.uni-scroll-view::-webkit-scrollbar) {
  width: 4px;
  height: 4px;
}

:deep(.uni-scroll-view::-webkit-scrollbar-thumb) {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}

/* 页面滚动条 */
page {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
}
</style>
