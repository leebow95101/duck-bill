<template>
  <view class="page-header" :class="{ 'page-header--native': nativeAlign }">
    <view
      v-if="nativeAlign"
      class="page-header__nav"
      :style="{
        paddingTop: `${statusBarHeight}px`,
        height: `${statusBarHeight + navBarHeight}px`,
      }"
    >
      <text class="page-title">{{ title }}</text>
    </view>
    <text v-else class="page-title">{{ title }}</text>
    <text v-if="subtitle" class="page-subtitle" :class="{ 'page-subtitle--native': nativeAlign }">{{ subtitle }}</text>
    <slot />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    nativeAlign?: boolean
  }>(),
  {
    nativeAlign: false,
  },
)

const statusBarHeight = ref(20)
const navBarHeight = ref(44)

if (props.nativeAlign) {
  const systemInfo = uni.getSystemInfoSync()
  const menuButton = typeof uni.getMenuButtonBoundingClientRect === 'function' ? uni.getMenuButtonBoundingClientRect() : null
  statusBarHeight.value = systemInfo.statusBarHeight ?? 20
  navBarHeight.value = menuButton
    ? (menuButton.top - statusBarHeight.value) * 2 + menuButton.height
    : 44
}

</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-bottom: 28rpx;
}

.page-header--native {
  gap: 0;
  margin-bottom: 24rpx;
}

.page-header__nav {
  display: flex;
  align-items: center;
}

.page-subtitle--native {
  margin-top: 4rpx;
}
</style>
