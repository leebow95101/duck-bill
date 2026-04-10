<template>
  <view class="app-page" :style="themeStore.themeVars">
    <page-header native-align title="主题切换" subtitle="修改一处主色，全局风格立即生效" />

    <view class="theme-grid">
      <view
        v-for="theme in themeStore.themePresets"
        :key="theme.key"
        class="theme-card section-card"
        :class="{ 'is-active': themeStore.themeKey === theme.key }"
        @tap="themeStore.setThemeKey(theme.key)"
      >
        <view class="theme-card__preview" :style="{ background: theme.primary }"></view>
        <text class="theme-card__name">{{ theme.name }}</text>
        <text class="theme-card__meta">{{ theme.primary }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<style scoped lang="scss">
.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;
}

.theme-card {
  padding: 24rpx;
}

.theme-card.is-active {
  outline: 4rpx solid var(--color-primary, #7c4dff);
}

.theme-card__preview {
  height: 120rpx;
  border-radius: 24rpx;
}

.theme-card__name,
.theme-card__meta {
  display: block;
}

.theme-card__name {
  margin-top: 16rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.theme-card__meta {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}
</style>
