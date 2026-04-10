<template>
  <view class="chip" :class="{ 'is-active': active }" @tap="$emit('click')">
    <slot>{{ label }}</slot>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  active?: boolean
}>()

defineEmits<{
  (event: 'click'): void
}>()
</script>
