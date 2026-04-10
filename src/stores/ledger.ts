import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import {
  createDefaultLedgerCoreData,
  createDefaultLedgerData,
} from '@/constants/ledger-defaults'
import type {
  AddTransactionPayload,
  BillFilter,
  LedgerData,
  RecurringTransaction,
  StatsRange,
  TransactionType,
  UserProfile,
} from '@/types/ledger'
import {
  formatMonthLabel,
  getMonthKey,
  getTodayKey,
  shiftMonth,
} from '@/utils/format'
import {
  createId,
  findTransactionById,
  getBudgetProgress,
  getCategoryStats,
  getGroupedTransactions,
  getMonthCompare,
  getMonthSummary,
  getRecentTransactions,
  getTodaySummary,
  getTransactions,
  getTrendData,
} from '@/utils/ledger'
import {
  LEDGER_STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  readStorage,
  writeStorage,
} from '@/utils/storage'
import { useAccountStore } from '@/stores/account'
import { useCategoryStore } from '@/stores/category'
import { useThemeStore } from '@/stores/theme'

type LedgerCoreState = {
  user: UserProfile
  budgets: LedgerData['budgets']
  recurring: LedgerData['recurring']
  transactions: LedgerData['transactions']
}

const now = new Date()
const currentMonth = getMonthKey(now)
const today = getTodayKey(now)
const defaultCoreData = createDefaultLedgerCoreData(currentMonth, today)
const legacyData = readStorage<LedgerData | null>(LEGACY_STORAGE_KEY, null)
const storedCoreData = readStorage<LedgerCoreState | null>(LEDGER_STORAGE_KEY, null)

const cloneCoreData = (data: LedgerCoreState) =>
  JSON.parse(JSON.stringify(data)) as LedgerCoreState

const resolveAvatarText = (nickname?: string, fallback = '鸭') => {
  const trimmed = nickname?.trim()
  if (!trimmed) {
    return fallback
  }
  return Array.from(trimmed)[0] || fallback
}

export const useLedgerStore = defineStore('ledger', () => {
  const categoryStore = useCategoryStore()
  const accountStore = useAccountStore()
  const themeStore = useThemeStore()

  const state = reactive({
    ready: false,
    currentMonth,
    billsFilter: 'all' as BillFilter,
    statsType: 'expense' as TransactionType,
    statsRange: 'month' as StatsRange,
    addSheetVisible: false,
    user:
      cloneCoreData(storedCoreData ?? legacyData ?? defaultCoreData).user,
    budgets:
      cloneCoreData(storedCoreData ?? legacyData ?? defaultCoreData).budgets,
    recurring:
      cloneCoreData(storedCoreData ?? legacyData ?? defaultCoreData).recurring,
    transactions:
      cloneCoreData(storedCoreData ?? legacyData ?? defaultCoreData)
        .transactions,
  })

  const persist = () => {
    writeStorage(LEDGER_STORAGE_KEY, {
      user: state.user,
      budgets: state.budgets,
      recurring: state.recurring,
      transactions: state.transactions,
    })
  }

  const resolveMonth = (month?: string) => month ?? state.currentMonth
  const syncAccountBalances = () => {
    accountStore.syncBalances(state.transactions)
  }

  const ledgerData = computed<LedgerData>(() => ({
    user: state.user,
    themeKey: themeStore.themeKey,
    categories: categoryStore.categories,
    accounts: accountStore.accounts,
    budgets: state.budgets,
    recurring: state.recurring,
    transactions: state.transactions,
  }))

  const summary = computed(() =>
    getMonthSummary(ledgerData.value, state.currentMonth),
  )
  const budgetProgress = computed(() =>
    getBudgetProgress(ledgerData.value, state.currentMonth),
  )
  const recentTransactions = computed(() =>
    getRecentTransactions(ledgerData.value),
  )
  const groupedTransactions = computed(() =>
    getGroupedTransactions(
      ledgerData.value,
      state.currentMonth,
      state.billsFilter,
    ),
  )
  const todaySummary = computed(() =>
    getTodaySummary(ledgerData.value, today),
  )
  const categoryStats = computed(() =>
    getCategoryStats(
      ledgerData.value,
      state.currentMonth,
      state.statsRange,
      state.statsType,
      themeStore.theme,
    ),
  )
  const trendData = computed(() =>
    getTrendData(ledgerData.value, state.currentMonth, state.statsRange),
  )
  const monthCompare = computed(() =>
    getMonthCompare(ledgerData.value, state.currentMonth),
  )

  const initStore = () => {
    if (state.ready) {
      return
    }
    syncAccountBalances()
    state.ready = true
    persist()
  }

  const addTransaction = (payload: AddTransactionPayload) => {
    state.transactions = [
      {
        id: createId('tx'),
        amount: payload.amount,
        type: payload.type,
        categoryId: payload.categoryId,
        accountId: payload.accountId,
        remark: payload.remark,
        date: payload.date,
        createdAt: new Date().toISOString(),
      },
      ...state.transactions,
    ]
    syncAccountBalances()
    persist()
  }

  const updateTransaction = (id: string, payload: AddTransactionPayload) => {
    const exists = state.transactions.some((item) => item.id === id)
    if (!exists) {
      return
    }
    state.transactions = state.transactions.map((item) =>
      item.id === id ? { ...item, ...payload } : item,
    )
    syncAccountBalances()
    persist()
  }

  const deleteTransaction = (id: string) => {
    state.transactions = state.transactions.filter((item) => item.id !== id)
    syncAccountBalances()
    persist()
  }

  const upsertBudget = (total: number, month?: string) => {
    const targetMonth = resolveMonth(month)
    const exists = state.budgets.some((item) => item.month === targetMonth)
    state.budgets = exists
      ? state.budgets.map((item) =>
          item.month === targetMonth ? { ...item, total } : item,
        )
      : [...state.budgets, { month: targetMonth, total }]
    persist()
  }

  const addRecurring = (payload: Omit<RecurringTransaction, 'id'>) => {
    state.recurring = [
      ...state.recurring,
      {
        ...payload,
        id: createId('rec'),
      },
    ]
    persist()
  }

  const toggleRecurring = (id: string) => {
    state.recurring = state.recurring.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item,
    )
    persist()
  }

  const deleteRecurring = (id: string) => {
    state.recurring = state.recurring.filter((item) => item.id !== id)
    persist()
  }

  const setUserProfile = (
    nickname: string,
    avatarText?: string,
    avatarUrl?: string,
  ) => {
    state.user = {
      nickname: nickname || '记账鸭',
      avatarText: avatarText || resolveAvatarText(nickname),
      avatarUrl: avatarUrl || '',
    }
    persist()
  }

  const hasLinkedCategory = (id: string) =>
    state.transactions.some((item) => item.categoryId === id)

  const hasLinkedAccount = (id: string) =>
    state.transactions.some((item) => item.accountId === id)

  const exportData = () => JSON.stringify(ledgerData.value, null, 2)

  const importData = (payload: string) => {
    try {
      const parsed = JSON.parse(payload) as LedgerData
      state.user = parsed.user
      state.budgets = parsed.budgets
      state.recurring = parsed.recurring
      state.transactions = parsed.transactions
      categoryStore.setCategories(parsed.categories)
      accountStore.setAccounts(parsed.accounts)
      themeStore.setThemeKey(parsed.themeKey)
      syncAccountBalances()
      persist()
      return true
    } catch (error) {
      console.warn('import failed', error)
      return false
    }
  }

  const resetDemoData = () => {
    const defaultData = createDefaultLedgerData(currentMonth, today)
    state.user = defaultData.user
    state.budgets = defaultData.budgets
    state.recurring = defaultData.recurring
    state.transactions = defaultData.transactions
    categoryStore.setCategories(defaultData.categories)
    accountStore.setAccounts(defaultData.accounts)
    themeStore.setThemeKey(defaultData.themeKey)
    syncAccountBalances()
    persist()
  }

  return {
    state,
    summary,
    budgetProgress,
    recentTransactions,
    groupedTransactions,
    todaySummary,
    categoryStats,
    trendData,
    monthCompare,
    initStore,
    setCurrentMonth: (month: string) => {
      state.currentMonth = month
    },
    shiftCurrentMonth: (offset: number) => {
      state.currentMonth = shiftMonth(state.currentMonth, offset)
    },
    setBillsFilter: (filter: BillFilter) => {
      state.billsFilter = filter
    },
    setStatsType: (type: TransactionType) => {
      state.statsType = type
    },
    setStatsRange: (range: StatsRange) => {
      state.statsRange = range
    },
    setAddSheetVisible: (visible: boolean) => {
      state.addSheetVisible = visible
    },
    getTransactions: (month?: string, filter: BillFilter = 'all') =>
      getTransactions(ledgerData.value, resolveMonth(month), filter),
    getMonthSummary: (month?: string) =>
      getMonthSummary(ledgerData.value, resolveMonth(month)),
    getBudgetProgress: (month?: string) =>
      getBudgetProgress(ledgerData.value, resolveMonth(month)),
    findTransactionById: (id: string) =>
      findTransactionById(state.transactions, id),
    addTransaction,
    updateTransaction,
    deleteTransaction,
    upsertBudget,
    addRecurring,
    toggleRecurring,
    deleteRecurring,
    setUserProfile,
    hasLinkedCategory,
    hasLinkedAccount,
    exportData,
    importData,
    resetDemoData,
    formatMonthLabel,
  }
})
