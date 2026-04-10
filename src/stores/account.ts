import { ref } from 'vue'
import { defineStore } from 'pinia'
import { defaultAccounts } from '@/constants/ledger-defaults'
import type { AccountItem, LedgerData, LedgerTransaction } from '@/types/ledger'
import { createId } from '@/utils/ledger'
import {
  ACCOUNT_STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  readStorage,
  writeStorage,
} from '@/utils/storage'

const legacyData = readStorage<LedgerData | null>(LEGACY_STORAGE_KEY, null)
const storedAccounts = readStorage<AccountItem[] | null>(ACCOUNT_STORAGE_KEY, null)

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<AccountItem[]>(
    storedAccounts ?? legacyData?.accounts ?? defaultAccounts,
  )

  const persist = () => {
    writeStorage(ACCOUNT_STORAGE_KEY, accounts.value)
  }

  const getAccountById = (id: string) =>
    accounts.value.find((item) => item.id === id)

  const addAccount = (payload: Omit<AccountItem, 'id' | 'balance'>) => {
    accounts.value = [
      ...accounts.value,
      {
        ...payload,
        id: createId('acc'),
        balance: 0,
      },
    ]
    persist()
  }

  const deleteAccount = (id: string) => {
    accounts.value = accounts.value.filter((item) => item.id !== id)
    persist()
  }

  const setAccounts = (items: AccountItem[]) => {
    accounts.value = items
    persist()
  }

  const syncBalances = (transactions: LedgerTransaction[]) => {
    accounts.value = accounts.value.map((account) => {
      const income = transactions
        .filter(
          (item) => item.accountId === account.id && item.type === 'income',
        )
        .reduce((sum, item) => sum + item.amount, 0)
      const expense = transactions
        .filter(
          (item) => item.accountId === account.id && item.type === 'expense',
        )
        .reduce((sum, item) => sum + item.amount, 0)

      return {
        ...account,
        balance: income - expense,
      }
    })
    persist()
  }

  return {
    accounts,
    getAccountById,
    addAccount,
    deleteAccount,
    setAccounts,
    syncBalances,
  }
})
