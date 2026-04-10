<template>
  <view class="app-page" :style="themeStore.themeVars">
    <page-header native-align title="分类管理" subtitle="自定义收入和支出分类" />

    <view class="section-card category-form">
      <view class="category-form__chips">
        <filter-chip label="支出" :active="type === 'expense'" @click="type = 'expense'" />
        <filter-chip label="收入" :active="type === 'income'" @click="type = 'income'" />
      </view>
      <input v-model="name" class="category-form__input" placeholder="分类名称，例如 咖啡 / 奖金" />
      <input v-model="icon" class="category-form__input" maxlength="2" placeholder="图标文字，例如 餐 / 奖" />
      <input v-model="color" class="category-form__input" placeholder="颜色值，例如 #7C4DFF" />
      <view class="primary-button" @tap="addCategory">新增分类</view>
    </view>

    <view class="section-card category-list">
      <view
        v-for="item in categoryStore.categories"
        :key="item.id"
        class="category-list__item"
      >
        <view class="category-list__meta">
          <view class="category-list__icon" :style="{ background: item.color }">{{ item.icon }}</view>
          <view>
            <text class="category-list__name">{{ item.name }}</text>
            <text class="category-list__type">{{ item.type === 'expense' ? '支出' : '收入' }}</text>
          </view>
        </view>
        <text class="category-list__delete" @tap="removeCategory(item.id)">删除</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FilterChip from '@/components/FilterChip.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useCategoryStore } from '@/stores/category'
import { useLedgerStore } from '@/stores/ledger'
import { useThemeStore } from '@/stores/theme'
import type { TransactionType } from '@/types/ledger'

const ledgerStore = useLedgerStore()
const categoryStore = useCategoryStore()
const themeStore = useThemeStore()
const type = ref<TransactionType>('expense')
const name = ref('')
const icon = ref('')
const color = ref('#7C4DFF')

const addCategory = () => {
  if (!name.value || !icon.value) {
    uni.showToast({ title: '请完整填写分类信息', icon: 'none' })
    return
  }
  categoryStore.addCategory({
    name: name.value,
    icon: icon.value,
    color: color.value || '#7C4DFF',
    type: type.value,
  })
  name.value = ''
  icon.value = ''
  uni.showToast({ title: '已新增', icon: 'success' })
}

const removeCategory = (id: string) => {
  if (ledgerStore.hasLinkedCategory(id)) {
    uni.showToast({ title: '该分类已有关联账单', icon: 'none' })
    return
  }
  categoryStore.deleteCategory(id)
}
</script>

<style scoped lang="scss">
.category-form,
.category-list {
  padding: 24rpx;
  margin-bottom: 24rpx;
}

.category-form__chips {
  display: flex;
  gap: 16rpx;
  margin-bottom: 18rpx;
}

.category-form__input {
  width: 100%;
  height: 84rpx;
  margin-bottom: 16rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: var(--color-primary-light, #f7f2ff);
}

.category-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 0;
}

.category-list__item + .category-list__item {
  border-top: 2rpx solid var(--color-border, #ece8f8);
}

.category-list__meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.category-list__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
}

.category-list__name,
.category-list__type {
  display: block;
}

.category-list__name {
  font-size: 28rpx;
  font-weight: 600;
}

.category-list__type {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.category-list__delete {
  font-size: 24rpx;
  color: var(--color-danger, #ff4d57);
}
</style>
