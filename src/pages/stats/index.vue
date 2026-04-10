<template>
  <view class="app-page" :style="themeStore.themeVars">
    <page-header native-align title="统计" subtitle="看清每一类钱都花在哪儿、赚自哪里" />

    <view class="section-card stats-toolbar">
      <view class="stats-toolbar__group">
        <filter-chip label="支出图表" :active="store.state.statsType === 'expense'" @click="store.setStatsType('expense')" />
        <filter-chip label="收入图表" :active="store.state.statsType === 'income'" @click="store.setStatsType('income')" />
      </view>
      <view class="stats-toolbar__group stats-toolbar__group--wrap">
        <filter-chip label="本月" :active="store.state.statsRange === 'month'" @click="store.setStatsRange('month')" />
        <filter-chip label="上月" :active="store.state.statsRange === 'lastMonth'" @click="store.setStatsRange('lastMonth')" />
        <filter-chip label="近 3 月" :active="store.state.statsRange === 'quarter'" @click="store.setStatsRange('quarter')" />
        <filter-chip label="全年" :active="store.state.statsRange === 'year'" @click="store.setStatsRange('year')" />
      </view>
    </view>

    <u-chart-card
      title="分类占比"
      :config="pieConfig"
      :empty="!hasCategoryStats"
      fallback="暂无分类统计，先去记一笔吧。"
      :height="340"
    />

    <view class="stats-list section-card">
      <view v-for="item in store.categoryStats" :key="item.categoryId" class="stats-list__item">
        <view class="stats-list__meta">
          <view class="stats-list__icon" :style="{ background: item.color }">{{ item.icon }}</view>
          <view>
            <text class="stats-list__name">{{ item.name }}</text>
            <text class="stats-list__percent">{{ (item.percent * 100).toFixed(1) }}%</text>
          </view>
        </view>
        <text class="stats-list__amount">{{ formatCurrency(item.amount) }}</text>
      </view>
    </view>

    <view class="compare-grid">
      <view class="compare-card section-card">
        <text class="compare-card__label">本月支出较上月</text>
        <text class="compare-card__value" :class="store.monthCompare.expenseChange > 0 ? 'danger-text' : 'success-text'">
          {{ store.monthCompare.expenseChange.toFixed(1) }}%
        </text>
      </view>
      <view class="compare-card section-card">
        <text class="compare-card__label">本月收入较上月</text>
        <text class="compare-card__value" :class="store.monthCompare.incomeChange >= 0 ? 'success-text' : 'danger-text'">
          {{ store.monthCompare.incomeChange.toFixed(1) }}%
        </text>
      </view>
    </view>

    <add-bill-sheet />
    <main-tab-bar active-key="stats" @add="openAdd" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AddBillSheet from '@/components/AddBillSheet.vue'
import FilterChip from '@/components/FilterChip.vue'
import MainTabBar from '@/components/MainTabBar.vue'
import PageHeader from '@/components/PageHeader.vue'
import UChartCard from '@/components/UChartCard.vue'
import { useLedgerStore } from '@/stores/ledger'
import { useThemeStore } from '@/stores/theme'
import { formatCurrency } from '@/utils/format'

const store = useLedgerStore()
const themeStore = useThemeStore()

const hasCategoryStats = computed(() => store.categoryStats.length > 0)

const pieConfig = computed(() => ({
  type: 'ring',
  series: store.categoryStats.map((item) => ({
    name: item.name,
    data: item.amount,
    color: item.color,
  })),
  legend: {
    show: false,
  },
  color: store.categoryStats.map((item) => item.color),
  padding: [12, 12, 0, 12],
  dataLabel: false,
  fontSize: 11,
  fontColor: '#606266',
  extra: {
    ring: {
      ringWidth: 26,
      activeOpacity: 1,
      activeRadius: 0,
      offsetAngle: -90,
      labelWidth: 0,
      border: false,
    },
    tooltip: {
      showBox: true,
      showArrow: false,
      bgColor: '#ffffff',
      bgOpacity: 0.96,
      borderColor: '#e7dcff',
      borderWidth: 1,
      borderRadius: 8,
      fontColor: '#303133',
    },
  },
}))

const openAdd = () => {
  store.setAddSheetVisible(true)
}
</script>

<style scoped lang="scss">
.stats-toolbar,
.stats-list {
  margin: 24rpx 0;
  padding: 24rpx;
}

.stats-toolbar__group {
  display: flex;
  gap: 16rpx;
}

.stats-toolbar__group + .stats-toolbar__group {
  margin-top: 16rpx;
}

.stats-toolbar__group--wrap {
  flex-wrap: wrap;
}

.stats-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
}

.stats-list__item + .stats-list__item {
  border-top: 2rpx solid var(--color-border, #ece8f8);
}

.stats-list__meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.stats-list__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  color: #fff;
  font-size: 26rpx;
  font-weight: 700;
}

.stats-list__name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
}

.stats-list__percent {
  display: block;
  margin-top: 4rpx;
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.stats-list__amount {
  font-size: 28rpx;
  font-weight: 700;
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.compare-card {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 24rpx;
}

.compare-card__label {
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.compare-card__value {
  font-size: 40rpx;
  font-weight: 700;
}
</style>
