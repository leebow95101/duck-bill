<template>
  <view class="app-page" :style="themeStore.themeVars">
    <page-header native-align title="账单" :subtitle="store.formatMonthLabel(store.state.currentMonth)" />

    <view class="toolbar section-card">
      <view class="toolbar__month">
        <text class="toolbar__arrow" @tap="store.shiftCurrentMonth(-1)">‹</text>
        <text class="toolbar__month-text">{{ store.formatMonthLabel(store.state.currentMonth) }}</text>
        <text class="toolbar__arrow" @tap="store.shiftCurrentMonth(1)">›</text>
      </view>
      <view class="toolbar__chips">
        <filter-chip label="全部" :active="store.state.billsFilter === 'all'" @click="store.setBillsFilter('all')" />
        <filter-chip label="收入" :active="store.state.billsFilter === 'income'" @click="store.setBillsFilter('income')" />
        <filter-chip label="支出" :active="store.state.billsFilter === 'expense'" @click="store.setBillsFilter('expense')" />
      </view>
    </view>

    <empty-state
      v-if="!store.groupedTransactions.length"
      title="暂无账单"
      description="去记一笔，让每一分钱都更有掌控感。"
      action-text="去记账"
      @action="openAdd"
    />

    <view v-else class="bill-groups">
      <view v-for="group in store.groupedTransactions" :key="group.date" class="bill-group">
        <view class="bill-group__head">
          <text class="bill-group__title">{{ group.label }}</text>
          <text class="bill-group__sum">
            收 {{ formatCurrency(group.income) }} / 支 {{ formatCurrency(group.expense) }}
          </text>
        </view>
        <up-swipe-action>
          <up-swipe-action-item
            v-for="item in group.list"
            :key="item.id"
            :name="item.id"
            :options="swipeOptions"
            @click="onSwipeClick"
          >
            <transaction-card :transaction="item" @click="editBill(item.id)" />
          </up-swipe-action-item>
        </up-swipe-action>
      </view>
    </view>

    <add-bill-sheet />
    <main-tab-bar active-key="bills" @add="openAdd" />
  </view>
</template>

<script setup lang="ts">
import AddBillSheet from '@/components/AddBillSheet.vue'
import EmptyState from '@/components/EmptyState.vue'
import FilterChip from '@/components/FilterChip.vue'
import MainTabBar from '@/components/MainTabBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import TransactionCard from '@/components/TransactionCard.vue'
import { useLedgerStore } from '@/stores/ledger'
import { useThemeStore } from '@/stores/theme'
import { formatCurrency } from '@/utils/format'

const store = useLedgerStore()
const themeStore = useThemeStore()

const swipeOptions = [
  { text: '编辑', style: { backgroundColor: '#7C4DFF' } },
  { text: '删除', style: { backgroundColor: '#FF4D57' } },
]

const openAdd = () => {
  store.setAddSheetVisible(true)
}

const editBill = (id: string) => {
  uni.navigateTo({ url: `/pages/edit-bill/index?id=${id}` })
}

const onSwipeClick = (id: string, index: number) => {
  if (index === 0) {
    editBill(id)
    return
  }
  store.deleteTransaction(id)
  uni.showToast({ title: '已删除', icon: 'success' })
}
</script>

<style scoped lang="scss">
.toolbar {
  padding: 24rpx;
}

.toolbar__month {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 22rpx;
}

.toolbar__arrow {
  width: 60rpx;
  font-size: 42rpx;
  text-align: center;
  color: var(--color-primary, #7c4dff);
}

.toolbar__month-text {
  font-size: 32rpx;
  font-weight: 700;
}

.toolbar__chips {
  display: flex;
  gap: 16rpx;
}

.bill-groups {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  margin-top: 28rpx;
}

.bill-group__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.bill-group__title {
  font-size: 30rpx;
  font-weight: 700;
}

.bill-group__sum {
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}
</style>
