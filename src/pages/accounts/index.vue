<template>
  <view class="app-page" :style="themeStore.themeVars">
    <page-header native-align title="账户管理" subtitle="统一管理现金、微信、支付宝和银行卡" />

    <view class="section-card account-form">
      <input v-model="name" class="account-form__input" placeholder="账户名称" />
      <input v-model="icon" class="account-form__input" maxlength="2" placeholder="图标文字，例如 微 / 卡" />
      <input v-model="color" class="account-form__input" placeholder="颜色值，例如 #1677FF" />
      <view class="primary-button" @tap="addAccount">新增账户</view>
    </view>

    <view class="section-card account-list">
      <view
        v-for="item in accountStore.accounts"
        :key="item.id"
        class="account-list__item"
      >
        <view class="account-list__meta">
          <view class="account-list__icon" :style="{ background: item.color }">{{ item.icon }}</view>
          <view>
            <text class="account-list__name">{{ item.name }}</text>
            <text class="account-list__balance">余额 {{ formatCurrency(item.balance) }}</text>
          </view>
        </view>
        <text class="account-list__delete" @tap="removeAccount(item.id)">删除</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useAccountStore } from '@/stores/account'
import { useLedgerStore } from '@/stores/ledger'
import { useThemeStore } from '@/stores/theme'
import { formatCurrency } from '@/utils/format'

const ledgerStore = useLedgerStore()
const accountStore = useAccountStore()
const themeStore = useThemeStore()
const name = ref('')
const icon = ref('')
const color = ref('#1677FF')

const addAccount = () => {
  if (!name.value || !icon.value) {
    uni.showToast({ title: '请完整填写账户信息', icon: 'none' })
    return
  }
  accountStore.addAccount({
    name: name.value,
    icon: icon.value,
    color: color.value || '#1677FF',
  })
  name.value = ''
  icon.value = ''
  uni.showToast({ title: '已新增', icon: 'success' })
}

const removeAccount = (id: string) => {
  if (ledgerStore.hasLinkedAccount(id)) {
    uni.showToast({ title: '该账户已有关联账单', icon: 'none' })
    return
  }
  accountStore.deleteAccount(id)
}
</script>

<style scoped lang="scss">
.account-form,
.account-list {
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.account-form__input {
  width: 100%;
  height: 84rpx;
  margin-bottom: 16rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: var(--color-primary-light, #f7f2ff);
}

.account-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14rpx 0;
}

.account-list__item + .account-list__item {
  border-top: 2rpx solid var(--color-border, #ece8f8);
}

.account-list__meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.account-list__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  border-radius: 24rpx;
  color: #fff;
  font-weight: 700;
}

.account-list__name,
.account-list__balance {
  display: block;
}

.account-list__name {
  font-size: 28rpx;
  font-weight: 600;
}

.account-list__balance {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.account-list__delete {
  font-size: 24rpx;
  color: var(--color-danger, #ff4d57);
}
</style>
