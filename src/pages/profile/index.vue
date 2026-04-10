<template>
  <view class="app-page" :style="themeStore.themeVars">
    <custom-nav-spacer />
    <view class="profile-hero section-card">
      <image
        v-if="ledgerStore.state.user.avatarUrl"
        class="profile-hero__avatar profile-hero__avatar--image"
        :src="ledgerStore.state.user.avatarUrl"
        mode="aspectFill"
      />
      <view v-else class="profile-hero__avatar">{{ ledgerStore.state.user.avatarText }}</view>
      <view class="profile-hero__main">
        <text class="profile-hero__name">{{ ledgerStore.state.user.nickname }}</text>
        <text class="profile-hero__desc">记录碎银几两，治愈存钱焦虑</text>
      </view>
      <view class="profile-hero__action" :class="{ 'is-disabled': authLoading }" @tap="authorizeWechatProfile">
        {{ authLoading ? '授权中...' : authButtonText }}
      </view>
    </view>

    <view class="menu-list section-card">
      <view v-for="item in menuItems" :key="item.path" class="menu-list__item" @tap="go(item.path)">
        <view>
          <text class="menu-list__title">{{ item.title }}</text>
          <text class="menu-list__desc">{{ item.desc }}</text>
        </view>
        <text class="menu-list__arrow">›</text>
      </view>
    </view>

    <text class="profile-version">版本号 1.0.0</text>

    <add-bill-sheet />
    <main-tab-bar active-key="profile" @add="openAdd" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AddBillSheet from '@/components/AddBillSheet.vue'
import CustomNavSpacer from '@/components/CustomNavSpacer.vue'
import MainTabBar from '@/components/MainTabBar.vue'
import { useLedgerStore } from '@/stores/ledger'
import { useThemeStore } from '@/stores/theme'

const ledgerStore = useLedgerStore()
const themeStore = useThemeStore()
const authLoading = ref(false)

const authButtonText = computed(() =>
  ledgerStore.state.user.nickname === '记账鸭' ? '微信授权' : '重新授权',
)

const menuItems = [
  { title: '预算设置', desc: '设置月预算并查看超支提醒', path: '/pages/budget/index' },
  { title: '分类管理', desc: '自定义收入与支出分类', path: '/pages/categories/index' },
  { title: '账户管理', desc: '现金、微信、支付宝、银行卡', path: '/pages/accounts/index' },
  { title: '固定收支管理', desc: '房租、工资等固定流水', path: '/pages/recurring/index' },
  { title: '数据备份 / 导出', desc: '复制 JSON 数据进行备份', path: '/pages/backup/index' },
  { title: '主题切换', desc: '切换全局主题色', path: '/pages/theme/index' },
  { title: '关于与帮助', desc: '产品说明、建议与版本信息', path: '/pages/about/index' },
]

const openAdd = () => {
  ledgerStore.setAddSheetVisible(true)
}

const go = (path: string) => {
  uni.navigateTo({ url: path })
}

const authorizeWechatProfile = async () => {
  if (authLoading.value) {
    return
  }

  // #ifndef MP-WEIXIN
  uni.showToast({ title: '请在微信小程序中授权', icon: 'none' })
  return
  // #endif

  // #ifdef MP-WEIXIN
  try {
    authLoading.value = true
    const result = await (uni as any).getUserProfile({
      desc: '用于完善头像和昵称信息',
      lang: 'zh_CN',
    })
    const profile = (result?.userInfo ?? {}) as {
      nickName?: string
      avatarUrl?: string
    }
    const nickname = profile.nickName ?? '微信用户'
    const avatarUrl = profile.avatarUrl ?? ''
    const avatarText = Array.from(nickname)[0] || '微'

    ledgerStore.setUserProfile(nickname, avatarText, avatarUrl)
    uni.showToast({ title: '授权成功', icon: 'success' })
  } catch (error: any) {
    if (error?.errMsg?.includes('fail auth deny')) {
      uni.showToast({ title: '你已取消授权', icon: 'none' })
      return
    }
    uni.showToast({ title: '授权失败，请重试', icon: 'none' })
  } finally {
    authLoading.value = false
  }
  // #endif
}
</script>

<style scoped lang="scss">
.profile-hero {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 32rpx 24rpx;
}

.profile-hero__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 108rpx;
  height: 108rpx;
  border-radius: 36rpx;
  background: var(--color-primary-soft, #efe7ff);
  color: var(--color-primary, #7c4dff);
  font-size: 42rpx;
  font-weight: 700;
  overflow: hidden;
}

.profile-hero__avatar--image {
  display: block;
}

.profile-hero__main {
  flex: 1;
}

.profile-hero__name {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
}

.profile-hero__desc {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.profile-hero__action {
  padding: 18rpx 22rpx;
  border-radius: 999rpx;
  background: var(--color-primary-soft, #efe7ff);
  color: var(--color-primary, #7c4dff);
  font-size: 24rpx;
}

.profile-hero__action.is-disabled {
  opacity: 0.7;
}

.menu-list {
  margin-top: 24rpx;
  padding: 0 24rpx;
}

.menu-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 116rpx;
  border-bottom: 2rpx solid var(--color-border, #ece8f8);
}

.menu-list__item:last-child {
  border-bottom: 0;
}

.menu-list__title {
  display: block;
  font-size: 30rpx;
  font-weight: 600;
}

.menu-list__desc {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.menu-list__arrow {
  font-size: 36rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.profile-version {
  display: block;
  margin-top: 28rpx;
  text-align: center;
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}
</style>
