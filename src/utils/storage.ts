export const LEGACY_STORAGE_KEY = 'duck-bill-data'
export const LEDGER_STORAGE_KEY = 'duck-bill-ledger'
export const CATEGORY_STORAGE_KEY = 'duck-bill-categories'
export const ACCOUNT_STORAGE_KEY = 'duck-bill-accounts'
export const THEME_STORAGE_KEY = 'duck-bill-theme'

export const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const value = uni.getStorageSync(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch (error) {
    console.warn('readStorage failed', error)
    return fallback
  }
}

export const writeStorage = <T>(key: string, value: T) => {
  try {
    uni.setStorageSync(key, JSON.stringify(value))
  } catch (error) {
    console.warn('writeStorage failed', error)
  }
}
