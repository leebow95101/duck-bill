import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import uviewPlus from 'uview-plus'
import '@/styles/uview.scss'
import App from './App.vue'
import { useLedgerStore } from '@/stores/ledger'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  app.use(uviewPlus)
  const ledgerStore = useLedgerStore()
  ledgerStore.initStore()

  return {
    app,
  }
}
