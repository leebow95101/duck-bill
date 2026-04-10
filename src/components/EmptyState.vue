<template>
  <view class="empty-state section-card">
    <view class="empty-state__icon">{{ icon }}</view>
    <text class="empty-state__title">{{ title }}</text>
    <text class="empty-state__desc">{{ description }}</text>
    <view v-if="actionText" class="primary-button empty-state__button" @tap="$emit('action')">
      {{ actionText }}
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    title: string
    description: string
    actionText?: string
  }>(),
  {
    icon: '记',
  },
)

defineEmits<{
  (event: 'action'): void
}>()
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 56rpx 40rpx;
  text-align: center;
}

.empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104rpx;
  height: 104rpx;
  border-radius: 32rpx;
  background: var(--color-primary-soft, #efe7ff);
  color: var(--color-primary, #7c4dff);
  font-size: 42rpx;
  font-weight: 700;
}

.empty-state__title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--color-text, #18181b);
}

.empty-state__desc {
  font-size: 26rpx;
  line-height: 1.6;
  color: var(--color-text-muted, #8b8ba0);
}

.empty-state__button {
  margin-top: 8rpx;
}
</style>
