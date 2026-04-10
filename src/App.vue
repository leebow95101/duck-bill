<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { useLedgerStore } from '@/stores/ledger'

const ledgerStore = useLedgerStore()

onLaunch(() => {
  ledgerStore.initStore()
})
</script>

<style lang="scss">
@import '@/uni.scss';

page {
  background: var(--color-background, #f7f8fc);
  color: var(--color-text, #18181b);
  font-family:
    'PingFang SC',
    'Helvetica Neue',
    Arial,
    sans-serif;
}

view,
text,
button,
input,
textarea {
  box-sizing: border-box;
}

button {
  padding: 0;
  margin: 0;
  background: transparent;
  border: 0;
  line-height: 1;
}

button::after {
  border: 0;
}

.app-page {
  min-height: 100vh;
  padding: 24rpx $ledger-page-padding $ledger-bottom-safe;
  background: var(--color-background, #f7f8fc);
}

.page-title {
  font-size: 52rpx;
  font-weight: 700;
  color: var(--color-text, #18181b);
}

.page-subtitle {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: var(--color-text-muted, #8b8ba0);
}

.section-title {
  font-size: 42rpx;
  font-weight: 700;
  color: var(--color-text, #18181b);
}

.section-card {
  background: var(--color-card, #fff);
  border-radius: 32rpx;
  box-shadow: var(--shadow-soft, $ledger-shadow-card);
}

.soft-card {
  background: var(--color-card-muted, #f9f6ff);
  border-radius: 28rpx;
}

.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
  height: 72rpx;
  padding: 0 26rpx;
  border-radius: 999rpx;
  border: 2rpx solid var(--color-border, #ece8f8);
  font-size: 26rpx;
  color: var(--color-text, #18181b);
  background: #fff;
}

.chip.is-active {
  color: var(--color-primary, #7c4dff);
  background: var(--color-primary-soft, #efe7ff);
  border-color: transparent;
}

.primary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 96rpx;
  min-height: 84rpx;
  border-radius: 28rpx;
  background: var(--color-primary, #7c4dff);
  color: #fff;
  font-size: 32rpx;
  font-weight: 700;
  box-shadow: var(--shadow-soft, $ledger-shadow-soft);
}

.muted-text {
  color: var(--color-text-muted, #8b8ba0);
}

.danger-text {
  color: var(--color-danger, #ff4d57);
}

.success-text {
  color: var(--color-success, #00b578);
}
</style>
