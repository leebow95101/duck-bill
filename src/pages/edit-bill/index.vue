<template>
  <view class="app-page" :style="themeStore.themeVars">
    <page-header native-align title="编辑账单" subtitle="修改金额、分类、账户与备注" />

    <empty-state
      v-if="!bill"
      title="账单不存在"
      description="这条账单可能已被删除，请返回账单列表重新选择。"
    />

    <view v-else class="section-card edit-form">
      <view class="edit-form__chips">
        <filter-chip label="支出" :active="type === 'expense'" @click="type = 'expense'" />
        <filter-chip label="收入" :active="type === 'income'" @click="type = 'income'" />
      </view>
      <input v-model="amount" type="digit" class="edit-form__input" placeholder="金额" />
      <picker :range="categoryNames" @change="changeCategory">
        <view class="edit-form__picker">分类：{{ currentCategoryName }}</view>
      </picker>
      <picker :range="accountNames" @change="changeAccount">
        <view class="edit-form__picker">账户：{{ currentAccountName }}</view>
      </picker>
      <input v-model="remark" class="edit-form__input" placeholder="备注" />
      <view class="primary-button" @tap="save">保存修改</view>
      <view class="edit-form__delete" @tap="remove">删除这条账单</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import EmptyState from '@/components/EmptyState.vue'
import FilterChip from '@/components/FilterChip.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useAccountStore } from '@/stores/account'
import { useCategoryStore } from '@/stores/category'
import { useLedgerStore } from '@/stores/ledger'
import { useThemeStore } from '@/stores/theme'
import type { TransactionType } from '@/types/ledger'

const ledgerStore = useLedgerStore()
const categoryStore = useCategoryStore()
const accountStore = useAccountStore()
const themeStore = useThemeStore()

const billId = ref('')
const amount = ref('')
const remark = ref('')
const type = ref<TransactionType>('expense')
const categoryId = ref('')
const accountId = ref('')

const bill = computed(() => ledgerStore.findTransactionById(billId.value))
const categories = computed(() => categoryStore.getCategoriesByType(type.value))
const categoryNames = computed(() => categories.value.map((item) => item.name))
const accountNames = computed(() => accountStore.accounts.map((item) => item.name))
const currentCategoryName = computed(
  () => categoryStore.getCategoryById(categoryId.value)?.name || '请选择',
)
const currentAccountName = computed(
  () => accountStore.getAccountById(accountId.value)?.name || '请选择',
)

onLoad((query) => {
  billId.value = `${query?.id || ''}`
  const currentBill = ledgerStore.findTransactionById(billId.value)
  if (!currentBill) {
    return
  }
  amount.value = `${currentBill.amount}`
  remark.value = currentBill.remark
  type.value = currentBill.type
  categoryId.value = currentBill.categoryId
  accountId.value = currentBill.accountId
})

const changeCategory = (event: any) => {
  categoryId.value = categories.value[event.detail.value]?.id ?? categoryId.value
}

const changeAccount = (event: any) => {
  accountId.value = accountStore.accounts[event.detail.value]?.id ?? accountId.value
}

const save = () => {
  if (!bill.value) {
    return
  }
  ledgerStore.updateTransaction(bill.value.id, {
    amount: Number(amount.value || 0),
    type: type.value,
    categoryId: categoryId.value,
    accountId: accountId.value,
    remark: remark.value,
    date: bill.value.date,
  })
  uni.showToast({ title: '已保存', icon: 'success' })
}

const remove = () => {
  if (!bill.value) {
    return
  }
  ledgerStore.deleteTransaction(bill.value.id)
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.edit-form {
  padding: 24rpx;
}

.edit-form__chips {
  display: flex;
  gap: 16rpx;
  margin-bottom: 18rpx;
}

.edit-form__input,
.edit-form__picker {
  display: flex;
  align-items: center;
  width: 100%;
  height: 84rpx;
  margin-bottom: 16rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: var(--color-primary-light, #f7f2ff);
  font-size: 28rpx;
}

.edit-form__delete {
  margin-top: 24rpx;
  text-align: center;
  font-size: 26rpx;
  color: var(--color-danger, #ff4d57);
}
</style>
