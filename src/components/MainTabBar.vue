<template>
  <view class="main-tabbar">
    <view class="main-tabbar__panel section-card">
      <view
        v-for="tab in leftTabs"
        :key="tab.key"
        class="main-tabbar__item"
        :class="{ 'is-active': activeKey === tab.key }"
        @tap="switchPage(tab.path)"
      >
        <image
          class="main-tabbar__icon-image"
          :src="activeKey === tab.key ? tab.activeIcon : tab.icon"
          mode="aspectFit"
        />
        <text class="main-tabbar__label">{{ tab.label }}</text>
      </view>
      <view class="main-tabbar__placeholder" />
      <view
        v-for="tab in rightTabs"
        :key="tab.key"
        class="main-tabbar__item"
        :class="{ 'is-active': activeKey === tab.key }"
        @tap="switchPage(tab.path)"
      >
        <image
          class="main-tabbar__icon-image"
          :src="activeKey === tab.key ? tab.activeIcon : tab.icon"
          mode="aspectFit"
        />
        <text class="main-tabbar__label">{{ tab.label }}</text>
      </view>
      <view class="main-tabbar__plus" @tap="$emit('add')">
        <image
          class="main-tabbar__plus-image"
          src="/static/plus.png"
          mode="aspectFit"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mainTabs, type MainTabKey } from '@/constants/navigation'

const props = defineProps<{
  activeKey: MainTabKey
}>()

defineEmits<{
  (event: 'add'): void
}>()

const leftTabs = computed(() => mainTabs.slice(0, 2))
const rightTabs = computed(() => mainTabs.slice(2))

const switchPage = (path: string) => {
  if (getCurrentPages().at(-1)?.route === path.replace(/^\//, '')) {
    return
  }
  uni.reLaunch({ url: path })
}
</script>

<style scoped lang="scss">
.main-tabbar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
  background: linear-gradient(180deg, rgba(247, 248, 252, 0), rgba(247, 248, 252, 0.92) 26%);
}

.main-tabbar__panel {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 132rpx;
  padding: 20rpx 16rpx 14rpx;
  border-radius: 36rpx;
  box-shadow: 0 -10rpx 40rpx rgba(18, 24, 33, 0.05);
}

.main-tabbar__item,
.main-tabbar__placeholder {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

.main-tabbar__item {
  color: #b8b8c6;
}

.main-tabbar__item.is-active {
  color: var(--color-primary, #7c4dff);
}

.main-tabbar__icon-image {
  width: 40rpx;
  height: 40rpx;
}

.main-tabbar__label {
  font-size: 22rpx;
  font-weight: 500;
}

.main-tabbar__item.is-active .main-tabbar__label {
  font-weight: 700;
}

.main-tabbar__plus {
  position: absolute;
  left: 50%;
  top: -34rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 108rpx;
  height: 108rpx;
  margin-left: -54rpx;
  border: 10rpx solid #f7f8fc;
  border-radius: 50%;
  background: var(--color-primary, #7c4dff);
  box-shadow: var(--shadow-soft);

  .main-tabbar__plus-image {
    width: 50rpx;
    height: 50rpx;
  }
}
</style>
