export type TransactionType = 'expense' | 'income'
export type BillFilter = 'all' | TransactionType
export type StatsRange = 'month' | 'lastMonth' | 'quarter' | 'year'

export interface ThemeConfig {
  key: string
  name: string
  primary: string
  primarySoft: string
  primaryLight: string
  background: string
  card: string
  cardMuted: string
  text: string
  textMuted: string
  border: string
  success: string
  danger: string
  warning: string
  shadow: string
}

export interface UserProfile {
  nickname: string
  avatarText: string
  avatarUrl?: string
}

export interface CategoryItem {
  id: string
  name: string
  type: TransactionType
  icon: string
  color: string
}

export interface AccountItem {
  id: string
  name: string
  icon: string
  color: string
  balance: number
}

export interface BudgetSetting {
  month: string
  total: number
}

export interface RecurringTransaction {
  id: string
  name: string
  amount: number
  type: TransactionType
  categoryId: string
  accountId: string
  cycle: 'weekly' | 'monthly' | 'yearly'
  nextDate: string
  enabled: boolean
}

export interface LedgerTransaction {
  id: string
  amount: number
  type: TransactionType
  categoryId: string
  accountId: string
  remark: string
  date: string
  createdAt: string
}

export interface LedgerData {
  user: UserProfile
  themeKey: string
  categories: CategoryItem[]
  accounts: AccountItem[]
  budgets: BudgetSetting[]
  recurring: RecurringTransaction[]
  transactions: LedgerTransaction[]
}

export interface AddTransactionPayload {
  amount: number
  type: TransactionType
  categoryId: string
  accountId: string
  remark: string
  date: string
}
