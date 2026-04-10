<template>
  <view class="app-page" :style="themeStore.themeVars">
    <page-header native-align title="关于与帮助" subtitle="让每一分钱都有迹可循" />

    <view class="section-card about-page">
      <text class="about-page__title">记账鸭</text>
      <text class="about-page__text">这是一个简约中文记账小程序示例，支持首页概览、账单记录、统计分析、预算和主题切换。</text>
      <text class="about-page__title">功能说明</text>
      <text class="about-page__text">1. 首页查看本月收支和预算进度。</text>
      <text class="about-page__text">2. 账单页支持筛选、分组和删除编辑。</text>
      <text class="about-page__text">3. 统计页展示分类占比和收支趋势。</text>
      <text class="about-page__text">4. 我的页可进行预算、分类、账户、备份和主题管理。</text>
      <text class="about-page__footer">版本 1.0.0</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<style scoped lang="scss">
.about-page {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 28rpx 24rpx;
}

.about-page__title {
  margin-top: 8rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.about-page__text,
.about-page__footer {
  font-size: 26rpx;
  line-height: 1.7;
  color: var(--color-text-muted, #8b8ba0);
}

.about-page__footer {
  margin-top: 24rpx;
}
</style>
