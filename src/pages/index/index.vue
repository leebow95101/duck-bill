<template>
  <view class="app-page" :style="themeStore.themeVars">
    <page-header native-align title="月度收支概览" :subtitle="store.formatMonthLabel(store.state.currentMonth)" />

    <view class="overview-card section-card">
      <view class="overview-grid">
        <view class="overview-item">
          <text class="overview-label">本月收入</text>
          <text class="overview-value success-text">{{ formatCurrency(store.summary.income) }}</text>
        </view>
        <view class="overview-item">
          <text class="overview-label">本月支出</text>
          <text class="overview-value danger-text">{{ formatCurrency(store.summary.expense) }}</text>
        </view>
        <view class="overview-item">
          <text class="overview-label">本月结余</text>
          <text class="overview-value">{{ formatCurrency(store.summary.balance) }}</text>
        </view>
      </view>
    </view>

    <view class="budget-card section-card">
      <view class="budget-card__header">
        <text class="section-title">预算进度</text>
        <text class="muted-text">{{ formatCurrency(store.budgetProgress.expense) }} / {{ formatCurrency(store.budgetProgress.budget) }}</text>
      </view>
      <view class="budget-progress">
        <view class="budget-progress__bar" :class="{ 'is-over': store.budgetProgress.overspent }" :style="{ width: `${store.budgetProgress.ratio * 100}%` }" />
      </view>
      <text class="budget-card__note" :class="store.budgetProgress.overspent ? 'danger-text' : 'muted-text'">
        {{ store.budgetProgress.overspent ? '本月预算已超支，请注意控制支出' : '预算控制良好，继续保持' }}
      </text>
    </view>

    <view class="section-block">
      <view class="section-block__header">
        <text class="section-title">最近 5 条账单</text>
        <text class="section-block__link" @tap="goBills">查看全部</text>
      </view>
      <view class="transaction-list">
        <transaction-card
          v-for="item in store.recentTransactions"
          :key="item.id"
          :transaction="item"
          @click="editBill(item.id)"
        />
      </view>
    </view>

    <view class="quick-grid">
      <view class="quick-card section-card" @tap="showTodayExpense">
        <text class="quick-card__label">今日支出</text>
        <text class="quick-card__value danger-text">{{ formatCurrency(store.todaySummary.expense) }}</text>
      </view>
      <view class="quick-card section-card" @tap="showTodayIncome">
        <text class="quick-card__label">今日收入</text>
        <text class="quick-card__value success-text">{{ formatCurrency(store.todaySummary.income) }}</text>
      </view>
      <view class="quick-card quick-card--primary" @tap="openAdd">
        <text class="quick-card__label quick-card__label--light">记一笔</text>
        <text class="quick-card__value quick-card__value--light">快速添加账单</text>
      </view>
    </view>

    <add-bill-sheet />
    <main-tab-bar active-key="home" @add="openAdd" />
  </view>
</template>

<script setup lang="ts">
import AddBillSheet from '@/components/AddBillSheet.vue'
import MainTabBar from '@/components/MainTabBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import TransactionCard from '@/components/TransactionCard.vue'
import { useLedgerStore } from '@/stores/ledger'
import { useThemeStore } from '@/stores/theme'
import { formatCurrency } from '@/utils/format'

const store = useLedgerStore()
const themeStore = useThemeStore()

const openAdd = () => {
  store.setAddSheetVisible(true)
}

const goBills = () => {
  uni.reLaunch({ url: '/pages/bills/index' })
}

const editBill = (id: string) => {
  uni.navigateTo({ url: `/pages/edit-bill/index?id=${id}` })
}

const showTodayExpense = () => {
  uni.showToast({
    title: `今日支出 ${formatCurrency(store.todaySummary.expense)}`,
    icon: 'none',
  })
}

const showTodayIncome = () => {
  uni.showToast({
    title: `今日收入 ${formatCurrency(store.todaySummary.income)}`,
    icon: 'none',
  })
}
</script>

<style scoped lang="scss">
.overview-card,
.budget-card {
  margin-bottom: 28rpx;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  padding: 30rpx 24rpx;
}

.overview-item {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.overview-label,
.quick-card__label {
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.overview-value,
.quick-card__value {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--color-text, #18181b);
}

.budget-card {
  padding: 28rpx 24rpx;
}

.budget-card__header,
.section-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.budget-progress {
  height: 18rpx;
  margin: 24rpx 0 16rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: #ece8f8;
}

.budget-progress__bar {
  height: 100%;
  border-radius: 999rpx;
  background: var(--color-primary, #7c4dff);
}

.budget-progress__bar.is-over {
  background: var(--color-danger, #ff4d57);
}

.budget-card__note {
  font-size: 24rpx;
}

.section-block {
  margin-top: 12rpx;
}

.section-block__link {
  font-size: 26rpx;
  color: var(--color-primary, #7c4dff);
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 24rpx;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-top: 28rpx;
}

.quick-card {
  display: flex;
  min-height: 144rpx;
  flex-direction: column;
  justify-content: space-between;
  padding: 24rpx;
}

.quick-card--primary {
  background: var(--color-primary, #7c4dff);
  border-radius: 32rpx;
  box-shadow: var(--shadow-soft);
}

.quick-card__label--light,
.quick-card__value--light {
  color: #fff;
}
</style>
