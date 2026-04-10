import { defaultThemeKey } from '@/constants/theme'
import type {
  AccountItem,
  BudgetSetting,
  CategoryItem,
  LedgerData,
  LedgerTransaction,
  RecurringTransaction,
  UserProfile,
} from '@/types/ledger'

export const defaultUserProfile: UserProfile = {
  nickname: '记账鸭',
  avatarText: '鸭',
  avatarUrl: '',
}

export const defaultCategories: CategoryItem[] = [
  { id: 'cat-food', name: '餐饮', type: 'expense', icon: '餐', color: '#FF8A65' },
  { id: 'cat-traffic', name: '交通', type: 'expense', icon: '行', color: '#5B8DEF' },
  { id: 'cat-shopping', name: '购物', type: 'expense', icon: '购', color: '#F5A524' },
  { id: 'cat-home', name: '居住', type: 'expense', icon: '家', color: '#9B7BFF' },
  { id: 'cat-ent', name: '娱乐', type: 'expense', icon: '娱', color: '#FF5C93' },
  { id: 'cat-health', name: '医疗', type: 'expense', icon: '医', color: '#2BB3B1' },
  { id: 'cat-salary', name: '工资', type: 'income', icon: '薪', color: '#00B578' },
  { id: 'cat-bonus', name: '奖金', type: 'income', icon: '奖', color: '#27C5A0' },
  { id: 'cat-side', name: '副业', type: 'income', icon: '副', color: '#36A3FF' },
  { id: 'cat-transfer', name: '转账', type: 'income', icon: '转', color: '#7C4DFF' },
]

export const defaultAccounts: AccountItem[] = [
  { id: 'acc-wechat', name: '微信', icon: '微', color: '#08C160', balance: 3860 },
  { id: 'acc-alipay', name: '支付宝', icon: '支', color: '#1677FF', balance: 2180 },
  { id: 'acc-cash', name: '现金', icon: '现', color: '#FF8A65', balance: 680 },
  { id: 'acc-bank', name: '银行卡', icon: '卡', color: '#7C4DFF', balance: 16820 },
]

export const createDefaultBudgets = (currentMonth: string): BudgetSetting[] => [
  { month: currentMonth, total: 5800 },
]

export const createDefaultRecurring = (currentMonth: string): RecurringTransaction[] => [
  {
    id: 'rec-rent',
    name: '房租',
    amount: 2200,
    type: 'expense',
    categoryId: 'cat-home',
    accountId: 'acc-bank',
    cycle: 'monthly',
    nextDate: `${currentMonth}-28`,
    enabled: true,
  },
  {
    id: 'rec-salary',
    name: '固定工资',
    amount: 9800,
    type: 'income',
    categoryId: 'cat-salary',
    accountId: 'acc-bank',
    cycle: 'monthly',
    nextDate: `${currentMonth}-15`,
    enabled: true,
  },
]

export const createDefaultTransactions = (
  currentMonth: string,
  today: string,
): LedgerTransaction[] => [
  {
    id: 'tx-1',
    amount: 56,
    type: 'expense',
    categoryId: 'cat-food',
    accountId: 'acc-wechat',
    remark: '午饭和奶茶',
    date: `${today}T12:20:00`,
    createdAt: `${today}T12:20:00`,
  },
  {
    id: 'tx-2',
    amount: 18,
    type: 'expense',
    categoryId: 'cat-traffic',
    accountId: 'acc-alipay',
    remark: '地铁通勤',
    date: `${today}T08:20:00`,
    createdAt: `${today}T08:20:00`,
  },
  {
    id: 'tx-3',
    amount: 138,
    type: 'expense',
    categoryId: 'cat-shopping',
    accountId: 'acc-wechat',
    remark: '生活用品',
    date: `${today}T20:10:00`,
    createdAt: `${today}T20:10:00`,
  },
  {
    id: 'tx-4',
    amount: 9800,
    type: 'income',
    categoryId: 'cat-salary',
    accountId: 'acc-bank',
    remark: '本月工资到账',
    date: `${currentMonth}-15T09:00:00`,
    createdAt: `${currentMonth}-15T09:00:00`,
  },
  {
    id: 'tx-5',
    amount: 888,
    type: 'income',
    categoryId: 'cat-side',
    accountId: 'acc-wechat',
    remark: '接单收入',
    date: `${currentMonth}-06T22:00:00`,
    createdAt: `${currentMonth}-06T22:00:00`,
  },
  {
    id: 'tx-6',
    amount: 2200,
    type: 'expense',
    categoryId: 'cat-home',
    accountId: 'acc-bank',
    remark: '本月房租',
    date: `${currentMonth}-02T19:30:00`,
    createdAt: `${currentMonth}-02T19:30:00`,
  },
  {
    id: 'tx-7',
    amount: 96,
    type: 'expense',
    categoryId: 'cat-ent',
    accountId: 'acc-alipay',
    remark: '电影票',
    date: `${currentMonth}-08T20:15:00`,
    createdAt: `${currentMonth}-08T20:15:00`,
  },
  {
    id: 'tx-8',
    amount: 34,
    type: 'expense',
    categoryId: 'cat-food',
    accountId: 'acc-cash',
    remark: '早餐',
    date: `${currentMonth}-07T08:00:00`,
    createdAt: `${currentMonth}-07T08:00:00`,
  },
]

export const createDefaultLedgerData = (
  currentMonth: string,
  today: string,
): LedgerData => ({
  user: defaultUserProfile,
  themeKey: defaultThemeKey,
  categories: defaultCategories,
  accounts: defaultAccounts,
  budgets: createDefaultBudgets(currentMonth),
  recurring: createDefaultRecurring(currentMonth),
  transactions: createDefaultTransactions(currentMonth, today),
})

export const createDefaultLedgerCoreData = (
  currentMonth: string,
  today: string,
) => ({
  user: defaultUserProfile,
  budgets: createDefaultBudgets(currentMonth),
  recurring: createDefaultRecurring(currentMonth),
  transactions: createDefaultTransactions(currentMonth, today),
})
