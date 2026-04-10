<template>
  <view class="app-page" :style="themeStore.themeVars">
    <page-header native-align title="预算设置" :subtitle="store.formatMonthLabel(store.state.currentMonth)" />

    <view class="section-card budget-page">
      <text class="budget-page__label">本月预算金额</text>
      <input v-model="amount" type="digit" class="budget-page__input" placeholder="请输入预算金额" />
      <view class="budget-page__summary">
        <text>本月已支出：{{ formatCurrency(store.budgetProgress.expense) }}</text>
        <text :class="store.budgetProgress.overspent ? 'danger-text' : 'muted-text'">
          {{ store.budgetProgress.overspent ? '已超支' : '预算中' }}
        </text>
      </view>
      <view class="primary-button" @tap="saveBudget">保存预算</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useLedgerStore } from '@/stores/ledger'
import { useThemeStore } from '@/stores/theme'
import { formatCurrency } from '@/utils/format'

const store = useLedgerStore()
const themeStore = useThemeStore()
const amount = ref(`${store.budgetProgress.budget || ''}`)

const saveBudget = () => {
  store.upsertBudget(Number(amount.value || 0))
  uni.showToast({ title: '预算已保存', icon: 'success' })
}
</script>

<style scoped lang="scss">
.budget-page {
  padding: 28rpx 24rpx;
}

.budget-page__label {
  font-size: 28rpx;
  font-weight: 600;
}

.budget-page__input {
  height: 88rpx;
  margin: 18rpx 0 24rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: var(--color-primary-light, #f7f2ff);
  font-size: 34rpx;
  font-weight: 700;
}

.budget-page__summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 28rpx;
  font-size: 26rpx;
}
</style>
