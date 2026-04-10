import type {
  AccountItem,
  BillFilter,
  CategoryItem,
  LedgerData,
  LedgerTransaction,
  StatsRange,
  ThemeConfig,
  TransactionType,
} from '@/types/ledger'
import {
  clampNumber,
  formatDateLabel,
  isSameDay,
  isSameMonth,
  shiftMonth,
} from '@/utils/format'

export const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`

export const sortTransactions = (items: LedgerTransaction[]) =>
  [...items].sort(
    (left, right) =>
      new Date(right.date).getTime() - new Date(left.date).getTime(),
  )

export const getCategoryById = (categories: CategoryItem[], id: string) =>
  categories.find((item) => item.id === id)

export const getAccountById = (accounts: AccountItem[], id: string) =>
  accounts.find((item) => item.id === id)

export const getCategoriesByType = (
  categories: CategoryItem[],
  type: TransactionType,
) => categories.filter((item) => item.type === type)

export const findTransactionById = (
  transactions: LedgerTransaction[],
  id: string,
) => transactions.find((item) => item.id === id)

export const getTransactions = (
  data: LedgerData,
  month: string,
  filter: BillFilter = 'all',
) =>
  sortTransactions(
    data.transactions.filter((item) => {
      const matchesMonth = isSameMonth(item.date, month)
      const matchesFilter = filter === 'all' ? true : item.type === filter
      return matchesMonth && matchesFilter
    }),
  )

export const getRecentTransactions = (data: LedgerData, limit = 5) =>
  sortTransactions(data.transactions).slice(0, limit)

export const getMonthSummary = (data: LedgerData, month: string) => {
  const list = getTransactions(data, month)
  const income = list
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)
  const expense = list
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)
  return {
    income,
    expense,
    balance: income - expense,
  }
}

export const getBudgetProgress = (data: LedgerData, month: string) => {
  const budget = data.budgets.find((item) => item.month === month)?.total ?? 0
  const expense = getMonthSummary(data, month).expense
  const ratio = budget > 0 ? clampNumber(expense / budget, 0, 2) : 0
  return {
    budget,
    expense,
    ratio,
    overspent: budget > 0 && expense > budget,
  }
}

export const getTodaySummary = (data: LedgerData, today: string) => {
  const income = data.transactions
    .filter((item) => item.type === 'income' && isSameDay(item.date, today))
    .reduce((sum, item) => sum + item.amount, 0)
  const expense = data.transactions
    .filter((item) => item.type === 'expense' && isSameDay(item.date, today))
    .reduce((sum, item) => sum + item.amount, 0)
  return {
    income,
    expense,
  }
}

export const getGroupedTransactions = (
  data: LedgerData,
  month: string,
  filter: BillFilter = 'all',
) => {
  const grouped = new Map<string, LedgerTransaction[]>()
  getTransactions(data, month, filter).forEach((item) => {
    const key = item.date.slice(0, 10)
    const current = grouped.get(key) ?? []
    current.push(item)
    grouped.set(key, current)
  })

  return [...grouped.entries()].map(([date, list]) => {
    const income = list
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)
    const expense = list
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)

    return {
      date,
      label: formatDateLabel(date),
      income,
      expense,
      total: income - expense,
      list,
    }
  })
}

export const getStatsTransactions = (
  data: LedgerData,
  currentMonth: string,
  statsRange: StatsRange,
) => {
  if (statsRange === 'month') {
    return getTransactions(data, currentMonth)
  }
  if (statsRange === 'lastMonth') {
    return getTransactions(data, shiftMonth(currentMonth, -1))
  }
  if (statsRange === 'quarter') {
    const months = [0, -1, -2].map((offset) => shiftMonth(currentMonth, offset))
    return sortTransactions(
      data.transactions.filter((item) =>
        months.some((month) => isSameMonth(item.date, month)),
      ),
    )
  }

  const yearPrefix = currentMonth.slice(0, 4)
  return sortTransactions(
    data.transactions.filter((item) => item.date.startsWith(yearPrefix)),
  )
}

export const getCategoryStats = (
  data: LedgerData,
  currentMonth: string,
  statsRange: StatsRange,
  statsType: TransactionType,
  theme: ThemeConfig,
) => {
  const targetList = getStatsTransactions(data, currentMonth, statsRange).filter(
    (item) => item.type === statsType,
  )
  const total = targetList.reduce((sum, item) => sum + item.amount, 0)
  const grouped = new Map<string, number>()

  targetList.forEach((item) => {
    grouped.set(item.categoryId, (grouped.get(item.categoryId) ?? 0) + item.amount)
  })

  return [...grouped.entries()]
    .map(([categoryId, amount]) => {
      const category = getCategoryById(data.categories, categoryId)
      return {
        categoryId,
        amount,
        name: category?.name ?? '未分类',
        icon: category?.icon ?? '?',
        color: category?.color ?? theme.primary,
        percent: total > 0 ? amount / total : 0,
      }
    })
    .sort((left, right) => right.amount - left.amount)
}

export const getTrendData = (
  data: LedgerData,
  currentMonth: string,
  statsRange: StatsRange,
) => {
  const list = getStatsTransactions(data, currentMonth, statsRange)
  const map = new Map<string, { income: number; expense: number }>()

  list.forEach((item) => {
    const key = item.date.slice(0, 10)
    const current = map.get(key) ?? { income: 0, expense: 0 }
    current[item.type] += item.amount
    map.set(key, current)
  })

  return [...map.entries()]
    .sort(([left], [right]) => new Date(left).getTime() - new Date(right).getTime())
    .map(([date, value]) => ({
      date,
      label: date.slice(5),
      income: value.income,
      expense: value.expense,
    }))
}

export const getMonthCompare = (data: LedgerData, currentMonth: string) => {
  const current = getMonthSummary(data, currentMonth)
  const previous = getMonthSummary(data, shiftMonth(currentMonth, -1))
  const expenseChange = previous.expense
    ? ((current.expense - previous.expense) / previous.expense) * 100
    : 0
  const incomeChange = previous.income
    ? ((current.income - previous.income) / previous.income) * 100
    : 0

  return {
    current,
    previous,
    expenseChange,
    incomeChange,
  }
}

export const rebuildAccountBalances = (data: LedgerData): LedgerData => ({
  ...data,
  accounts: data.accounts.map((account) => {
    const income = data.transactions
      .filter((item) => item.accountId === account.id && item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)
    const expense = data.transactions
      .filter((item) => item.accountId === account.id && item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)

    return {
      ...account,
      balance: income - expense,
    }
  }),
})
