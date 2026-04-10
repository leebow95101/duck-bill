import { ref } from 'vue'
import { defineStore } from 'pinia'
import { defaultCategories } from '@/constants/ledger-defaults'
import type { CategoryItem, LedgerData, TransactionType } from '@/types/ledger'
import { createId } from '@/utils/ledger'
import {
  CATEGORY_STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  readStorage,
  writeStorage,
} from '@/utils/storage'

const legacyData = readStorage<LedgerData | null>(LEGACY_STORAGE_KEY, null)
const storedCategories = readStorage<CategoryItem[] | null>(
  CATEGORY_STORAGE_KEY,
  null,
)

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<CategoryItem[]>(
    storedCategories ?? legacyData?.categories ?? defaultCategories,
  )

  const persist = () => {
    writeStorage(CATEGORY_STORAGE_KEY, categories.value)
  }

  const getCategoryById = (id: string) =>
    categories.value.find((item) => item.id === id)

  const getCategoriesByType = (type: TransactionType) =>
    categories.value.filter((item) => item.type === type)

  const addCategory = (payload: Omit<CategoryItem, 'id'>) => {
    categories.value = [
      ...categories.value,
      {
        ...payload,
        id: createId('cat'),
      },
    ]
    persist()
  }

  const deleteCategory = (id: string) => {
    categories.value = categories.value.filter((item) => item.id !== id)
    persist()
  }

  const setCategories = (items: CategoryItem[]) => {
    categories.value = items
    persist()
  }

  return {
    categories,
    getCategoryById,
    getCategoriesByType,
    addCategory,
    deleteCategory,
    setCategories,
  }
})
