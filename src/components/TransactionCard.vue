<template>
  <view class="transaction-card section-card" @tap="$emit('click')">
    <view class="transaction-card__icon" :style="{ background: category?.color || 'var(--color-primary-soft)' }">
      <text>{{ category?.icon || '?' }}</text>
    </view>
    <view class="transaction-card__main">
      <text class="transaction-card__name">{{ category?.name || '未分类' }}</text>
      <text class="transaction-card__remark">{{ transaction.remark || account?.name || '暂无备注' }}</text>
    </view>
    <view class="transaction-card__side">
      <text class="transaction-card__amount" :class="amountClass">
        {{ amountText }}
      </text>
      <text class="transaction-card__time">{{ timeText }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LedgerTransaction } from '@/types/ledger'
import { formatCurrency, formatTimeLabel } from '@/utils/format'
import { useAccountStore } from '@/stores/account'
import { useCategoryStore } from '@/stores/category'

const props = defineProps<{
  transaction: LedgerTransaction
}>()

defineEmits<{
  (event: 'click'): void
}>()

const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

const category = computed(() =>
  categoryStore.getCategoryById(props.transaction.categoryId),
)
const account = computed(() =>
  accountStore.getAccountById(props.transaction.accountId),
)
const amountClass = computed(() =>
  props.transaction.type === 'income' ? 'success-text' : 'danger-text',
)
const amountText = computed(() => {
  const prefix = props.transaction.type === 'income' ? '+' : '-'
  return `${prefix} ${formatCurrency(props.transaction.amount)}`
})
const timeText = computed(() => formatTimeLabel(props.transaction.date))
</script>

<style scoped lang="scss">
.transaction-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
}

.transaction-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 28rpx;
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
}

.transaction-card__main {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 8rpx;
}

.transaction-card__name {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--color-text, #18181b);
}

.transaction-card__remark {
  overflow: hidden;
  font-size: 25rpx;
  color: var(--color-text-muted, #8b8ba0);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-card__side {
  display: flex;
  min-width: 132rpx;
  flex-direction: column;
  align-items: flex-end;
  gap: 10rpx;
}

.transaction-card__amount {
  font-size: 32rpx;
  font-weight: 700;
}

.transaction-card__time {
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}
</style>
