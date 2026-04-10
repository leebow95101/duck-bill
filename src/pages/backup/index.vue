<template>
  <view class="app-page" :style="themeStore.themeVars">
    <page-header native-align title="数据备份 / 导出" subtitle="支持导出 JSON 文本和重新导入" />

    <view class="section-card backup-page">
      <textarea v-model="jsonText" class="backup-page__textarea" maxlength="-1" />
      <view class="backup-page__actions">
        <view class="chip is-active" @tap="exportData">导出</view>
        <view class="chip" @tap="importData">导入</view>
        <view class="chip" @tap="resetData">重置演示数据</view>
      </view>
      <text class="backup-page__tip">提示：导出后可手动复制到本地保存，导入会覆盖当前账本数据。</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useLedgerStore } from '@/stores/ledger'
import { useThemeStore } from '@/stores/theme'

const store = useLedgerStore()
const themeStore = useThemeStore()
const jsonText = ref(store.exportData())

const exportData = () => {
  jsonText.value = store.exportData()
  uni.setClipboardData({ data: jsonText.value })
}

const importData = () => {
  const success = store.importData(jsonText.value)
  uni.showToast({ title: success ? '导入成功' : '导入失败', icon: success ? 'success' : 'none' })
}

const resetData = () => {
  store.resetDemoData()
  jsonText.value = store.exportData()
  uni.showToast({ title: '已重置', icon: 'success' })
}
</script>

<style scoped lang="scss">
.backup-page {
  padding: 24rpx;
}

.backup-page__textarea {
  width: 100%;
  min-height: 720rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: var(--color-primary-light, #f7f2ff);
  font-size: 24rpx;
  line-height: 1.6;
}

.backup-page__actions {
  display: flex;
  gap: 16rpx;
  margin: 20rpx 0 16rpx;
  flex-wrap: wrap;
}

.backup-page__tip {
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}
</style>
