<template>
  <view class="custom-nav-spacer" :style="{ height: `${spacerHeight}px` }" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const spacerHeight = ref(88)

const updateSpacerHeight = () => {
  const systemInfo = uni.getSystemInfoSync()
  const statusBarHeight = systemInfo.statusBarHeight ?? 20
  const menuButton = typeof uni.getMenuButtonBoundingClientRect === 'function' ? uni.getMenuButtonBoundingClientRect() : null

  if (!menuButton) {
    spacerHeight.value = statusBarHeight + 28
    return
  }

  spacerHeight.value = menuButton.bottom + 10
}

updateSpacerHeight()
</script>

<style scoped lang="scss">
.custom-nav-spacer {
  width: 100%;
  flex-shrink: 0;
}
</style>
