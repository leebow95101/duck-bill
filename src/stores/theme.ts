import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { defaultThemeKey, getThemeByKey, themePresets } from '@/constants/theme'
import type { LedgerData } from '@/types/ledger'
import {
  LEGACY_STORAGE_KEY,
  readStorage,
  THEME_STORAGE_KEY,
  writeStorage,
} from '@/utils/storage'

const legacyData = readStorage<LedgerData | null>(LEGACY_STORAGE_KEY, null)
const storedThemeKey = readStorage<string | null>(THEME_STORAGE_KEY, null)

export const useThemeStore = defineStore('theme', () => {
  const themeKey = ref(storedThemeKey ?? legacyData?.themeKey ?? defaultThemeKey)

  const persist = () => {
    writeStorage(THEME_STORAGE_KEY, themeKey.value)
  }

  const theme = computed(() => getThemeByKey(themeKey.value))
  const themeVars = computed(() => ({
    '--color-primary': theme.value.primary,
    '--color-primary-soft': theme.value.primarySoft,
    '--color-primary-light': theme.value.primaryLight,
    '--color-background': theme.value.background,
    '--color-card': theme.value.card,
    '--color-card-muted': theme.value.cardMuted,
    '--color-text': theme.value.text,
    '--color-text-muted': theme.value.textMuted,
    '--color-border': theme.value.border,
    '--color-success': theme.value.success,
    '--color-danger': theme.value.danger,
    '--color-warning': theme.value.warning,
    '--shadow-soft': theme.value.shadow,
  }))

  const setThemeKey = (key: string) => {
    themeKey.value = key
    persist()
  }

  return {
    themeKey,
    themePresets,
    theme,
    themeVars,
    setThemeKey,
  }
})
