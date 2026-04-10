<template>
  <up-popup
    v-model:show="visible"
    mode="bottom"
    round="24"
    :safeAreaInsetBottom="true"
    :closeOnClickOverlay="true"
    bgColor="#ffffff"
  >
    <view class="sheet">
      <view class="sheet__header">
        <text class="sheet__title">记一笔</text>
        <text class="sheet__close" @tap="close">关闭</text>
      </view>

      <view class="sheet__section">
        <text class="sheet__section-title">类型</text>
        <up-subsection
          :list="['支出', '收入']"
          :current="typeCurrent"
          activeColor="var(--color-primary)"
          inactiveColor="#8b8ba0"
          bgColor="#f6f3ff"
          @change="onTypeChange"
        />
      </view>

      <view class="sheet__section">
        <text class="sheet__section-title">分类</text>
        <scroll-view scroll-x class="sheet__categories">
          <view
            v-for="item in categoryOptions"
            :key="item.id"
            class="sheet__category"
            :class="{ 'is-active': form.categoryId === item.id }"
            @tap="selectCategory(item.id)"
          >
            <view class="sheet__category-icon" :style="{ background: item.color }">
              {{ item.icon }}
            </view>
            <text class="sheet__category-name">{{ item.name }}</text>
          </view>
        </scroll-view>
      </view>

      <view class="sheet__section">
        <text class="sheet__section-title">账户</text>
        <view class="sheet__account-list section-card">
          <view
            v-for="item in accountStore.accounts"
            :key="item.id"
            class="sheet__account-item"
            :class="{ 'is-active': form.accountId === item.id }"
            @tap="selectAccount(item.id)"
          >
            <view class="sheet__account-meta">
              <view class="sheet__account-icon" :style="{ background: item.color }">
                {{ item.icon }}
              </view>
              <view>
                <text class="sheet__account-name">{{ item.name }}</text>
                <text class="sheet__account-balance">
                  余额 {{ formatCurrency(item.balance) }}
                </text>
              </view>
            </view>
            <text class="sheet__account-mark">
              {{ form.accountId === item.id ? '已选' : '' }}
            </text>
          </view>
        </view>
      </view>

      <view class="sheet__section">
        <text class="sheet__section-title">金额</text>
        <view class="sheet__amount soft-card" :class="{ 'is-active': amountFocused }">
          <input
            v-model="amountValue"
            type="digit"
            confirm-type="done"
            class="sheet__amount-input"
            placeholder="请输入金额"
            :focus="amountAutoFocus"
            @focus="onAmountFocus"
            @blur="onAmountBlur"
          />
        </view>
      </view>

      <view class="sheet__section">
        <text class="sheet__section-title">备注</text>
        <input
          v-model="form.remark"
          class="sheet__input"
          maxlength="20"
          placeholder="写下这笔钱花在哪儿"
          @focus="onAmountBlur"
        />
      </view>

      <view class="sheet__section">
        <text class="sheet__section-title">时间</text>
        <view class="sheet__date-actions">
          <view class="chip" :class="{ 'is-active': quickDate === 'today' }" @tap="setQuickDate('today')">
            今天
          </view>
          <view class="chip" :class="{ 'is-active': quickDate === 'yesterday' }" @tap="setQuickDate('yesterday')">
            昨天
          </view>
          <picker mode="date" :value="datePickerValue" @change="onCustomDateChange">
            <view class="chip" :class="{ 'is-active': quickDate === 'custom' }">
              自定义
            </view>
          </picker>
        </view>
        <text class="sheet__date-text">{{ selectedDateLabel }}</text>
      </view>

      <view class="primary-button" @tap="submit">保存</view>
    </view>
  </up-popup>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useAccountStore } from '@/stores/account'
import { useCategoryStore } from '@/stores/category'
import { useLedgerStore } from '@/stores/ledger'
import { formatCurrency, getTodayKey } from '@/utils/format'

const ledgerStore = useLedgerStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()

const visible = computed({
  get: () => ledgerStore.state.addSheetVisible,
  set: (value: boolean) => ledgerStore.setAddSheetVisible(value),
})

const typeCurrent = ref(0)
const quickDate = ref<'today' | 'yesterday' | 'custom'>('today')
const amountValue = ref('')
const amountFocused = ref(false)
const amountAutoFocus = ref(false)

const form = reactive({
  categoryId: '',
  accountId: '',
  remark: '',
  date: `${getTodayKey()}T12:00:00`,
})

const transactionType = computed(() =>
  typeCurrent.value === 0 ? 'expense' : 'income',
)
const categoryOptions = computed(() =>
  categoryStore.getCategoriesByType(transactionType.value),
)
const selectedDateLabel = computed(() => form.date.slice(0, 10).replaceAll('-', ' / '))
const datePickerValue = computed(() => form.date.slice(0, 10))

const resetForm = () => {
  typeCurrent.value = 0
  quickDate.value = 'today'
  amountValue.value = ''
  amountFocused.value = false
  amountAutoFocus.value = false
  form.categoryId = categoryStore.getCategoriesByType('expense')[0]?.id ?? ''
  form.accountId = accountStore.accounts[0]?.id ?? ''
  form.remark = ''
  form.date = `${getTodayKey()}T12:00:00`
}

watch(
  () => visible.value,
  (show) => {
    if (show) {
      resetForm()
    }
  },
  { immediate: true },
)

watch(categoryOptions, (value) => {
  if (!value.some((item) => item.id === form.categoryId)) {
    form.categoryId = value[0]?.id ?? ''
  }
})

const onTypeChange = (index: number) => {
  typeCurrent.value = index
}

const onAmountFocus = () => {
  amountFocused.value = true
  amountAutoFocus.value = true
}

const onAmountBlur = () => {
  amountFocused.value = false
  amountAutoFocus.value = false
}

const selectCategory = (id: string) => {
  form.categoryId = id
}

const selectAccount = (id: string) => {
  form.accountId = id
}

const setQuickDate = (type: 'today' | 'yesterday') => {
  quickDate.value = type
  const current = new Date()
  if (type === 'yesterday') {
    current.setDate(current.getDate() - 1)
  }
  const date = `${current.getFullYear()}-${`${current.getMonth() + 1}`.padStart(2, '0')}-${`${current.getDate()}`.padStart(2, '0')}`
  form.date = `${date}T12:00:00`
}

const onCustomDateChange = (event: { detail: { value: string } }) => {
  quickDate.value = 'custom'
  form.date = `${event.detail.value}T12:00:00`
}

const close = () => {
  onAmountBlur()
  visible.value = false
}

const submit = () => {
  const amount = Number(amountValue.value || 0)
  if (!amount) {
    uni.showToast({ title: '请输入金额', icon: 'none' })
    return
  }
  if (!form.categoryId || !form.accountId) {
    uni.showToast({ title: '请选择分类和账户', icon: 'none' })
    return
  }
  ledgerStore.addTransaction({
    amount,
    type: transactionType.value,
    categoryId: form.categoryId,
    accountId: form.accountId,
    remark: form.remark,
    date: form.date,
  })
  close()
  uni.showToast({ title: '已保存', icon: 'success' })
}
</script>

<style scoped lang="scss">
.sheet {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  height: 68vh;
  overflow-y: auto;
  padding: 28rpx 28rpx calc(env(safe-area-inset-bottom) + 28rpx);
}

.sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sheet__title {
  font-size: 40rpx;
  font-weight: 700;
}

.sheet__close {
  font-size: 28rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.sheet__section {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.sheet__section-title {
  font-size: 28rpx;
  font-weight: 600;
}

.sheet__categories {
  white-space: nowrap;
}

.sheet__category {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  width: 120rpx;
  margin-right: 16rpx;
  padding: 16rpx 8rpx;
  border-radius: 28rpx;
  border: 2rpx solid transparent;
  background: #fff;
}

.sheet__category.is-active {
  border-color: var(--color-primary, #7c4dff);
  background: var(--color-primary-light, #f7f2ff);
}

.sheet__category-icon {
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

.sheet__category-name {
  font-size: 24rpx;
}

// .sheet__account-list {
  // padding: 0 24rpx;
// }

.sheet__account-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 116rpx;
  padding: 0 24rpx;
  border-bottom: 2rpx solid var(--color-border, #ece8f8);
}

.sheet__account-item:last-child {
  border-bottom: 0;
}

.sheet__account-item.is-active {
  color: var(--color-primary, #7c4dff);
  background: var(--color-primary-light, #f7f2ff);
  border: 2rpx solid var(--color-primary, #7c4dff);
  border-radius: 8rpx;
}

.sheet__account-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.sheet__account-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  border-radius: 24rpx;
  color: #fff;
  font-weight: 700;
}

.sheet__account-name,
.sheet__account-balance {
  display: block;
}

.sheet__account-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-text, #18181b);
}

.sheet__account-balance {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.sheet__account-mark {
  font-size: 24rpx;
  color: var(--color-primary, #7c4dff);
}

.sheet__amount {
  padding: 24rpx;
  border: 2rpx solid transparent;
}

.sheet__amount.is-active {
  border-color: var(--color-primary, #7c4dff);
}

.sheet__label {
  display: block;
  margin-bottom: 12rpx;
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.sheet__amount-input {
  width: 100%;
  height: 30rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: var(--color-text, #18181b);
}

.sheet__input {
  width: 100%;
  height: 28rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: #fff;
}

.sheet__date-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
}

.sheet__date-text {
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}
</style>
