<template>
  <view class="app-page" :style="themeStore.themeVars">
    <page-header native-align title="固定收支管理" subtitle="管理房租、工资等固定流水" />

    <view class="section-card recurring-form">
      <view class="recurring-form__chips">
        <filter-chip label="支出" :active="type === 'expense'" @click="type = 'expense'" />
        <filter-chip label="收入" :active="type === 'income'" @click="type = 'income'" />
      </view>
      <input v-model="name" class="recurring-form__input" placeholder="名称，例如 房租 / 固定工资" />
      <input v-model="amount" type="digit" class="recurring-form__input" placeholder="金额" />
      <view class="primary-button" @tap="addRecurring">新增固定收支</view>
    </view>

    <view class="section-card recurring-list">
      <view
        v-for="item in ledgerStore.state.recurring"
        :key="item.id"
        class="recurring-list__item"
      >
        <view>
          <text class="recurring-list__name">{{ item.name }}</text>
          <text class="recurring-list__meta">
            {{ item.type === 'expense' ? '支出' : '收入' }} · {{ item.cycle === 'monthly' ? '每月' : item.cycle }}
          </text>
        </view>
        <view class="recurring-list__actions">
          <text class="recurring-list__amount">{{ formatCurrency(item.amount) }}</text>
          <text class="recurring-list__toggle" @tap="ledgerStore.toggleRecurring(item.id)">
            {{ item.enabled ? '停用' : '启用' }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FilterChip from '@/components/FilterChip.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useAccountStore } from '@/stores/account'
import { useCategoryStore } from '@/stores/category'
import { useLedgerStore } from '@/stores/ledger'
import { useThemeStore } from '@/stores/theme'
import { getTodayKey, formatCurrency } from '@/utils/format'
import type { TransactionType } from '@/types/ledger'

const ledgerStore = useLedgerStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()
const themeStore = useThemeStore()
const type = ref<TransactionType>('expense')
const name = ref('')
const amount = ref('')

const addRecurring = () => {
  if (!name.value || !amount.value) {
    uni.showToast({ title: '请完整填写信息', icon: 'none' })
    return
  }
  const category = categoryStore.getCategoriesByType(type.value)[0]
  const account = accountStore.accounts[0]
  ledgerStore.addRecurring({
    name: name.value,
    amount: Number(amount.value),
    type: type.value,
    categoryId: category?.id ?? '',
    accountId: account?.id ?? '',
    cycle: 'monthly',
    nextDate: getTodayKey(),
    enabled: true,
  })
  name.value = ''
  amount.value = ''
  uni.showToast({ title: '已新增', icon: 'success' })
}
</script>

<style scoped lang="scss">
.recurring-form,
.recurring-list {
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.recurring-form__chips {
  display: flex;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.recurring-form__input {
  width: 100%;
  height: 84rpx;
  margin-bottom: 16rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: var(--color-primary-light, #f7f2ff);
}

.recurring-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14rpx 0;
}

.recurring-list__item + .recurring-list__item {
  border-top: 2rpx solid var(--color-border, #ece8f8);
}

.recurring-list__name,
.recurring-list__meta {
  display: block;
}

.recurring-list__name {
  font-size: 28rpx;
  font-weight: 600;
}

.recurring-list__meta {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.recurring-list__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.recurring-list__amount {
  font-size: 28rpx;
  font-weight: 700;
}

.recurring-list__toggle {
  font-size: 24rpx;
  color: var(--color-primary, #7c4dff);
}
</style>
