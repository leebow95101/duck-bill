<template>
  <view class="chart-card section-card">
    <view class="chart-card__title">{{ title }}</view>
    <view v-if="empty" class="chart-card__fallback">
      <text class="chart-card__fallback-text">{{ fallback }}</text>
    </view>
    <canvas
      v-else
      :id="canvasId"
      :canvas-id="canvasId"
      :width="canvasWidth || 300"
      :height="chartHeightPx"
      class="chart-card__canvas"
      :style="canvasStyle"
    />
  </view>
</template>

<script setup lang="ts">
import UCharts from '@qiun/ucharts'
import { onReady } from '@dcloudio/uni-app'
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, ref, watch } from 'vue'

type UChartConfig = {
  type: string
  categories?: string[]
  series?: Record<string, any>[]
  extra?: Record<string, any>
  legend?: Record<string, any>
  xAxis?: Record<string, any>
  yAxis?: Record<string, any>
  color?: string[]
  padding?: number[]
  dataLabel?: boolean
  enableScroll?: boolean
  fontSize?: number
  fontColor?: string
}

const props = defineProps<{
  title: string
  config: UChartConfig
  fallback: string
  height?: number
  empty?: boolean
}>()

const instance = getCurrentInstance()
const canvasId = `uchart-${Math.random().toString(16).slice(2, 10)}`
const chartHeightPx = computed(() => uni.upx2px(props.height ?? 320))
const canvasWidth = ref(0)
const canvasStyle = computed(() => ({
  width: '100%',
  height: `${chartHeightPx.value}px`,
}))

let chart: any = null
let renderVersion = 0

const getCanvasWidth = () =>
  new Promise<number>((resolve) => {
    const query = uni.createSelectorQuery().in(instance?.proxy as any)
    query
      .select(`#${canvasId}`)
      .boundingClientRect((rect) => {
        const nodeRect = Array.isArray(rect) ? rect[0] : rect
        resolve(nodeRect?.width ?? 0)
      })
      .exec()
  })

const createCanvasContext = () => uni.createCanvasContext(canvasId, instance?.proxy as any)

const clearCanvas = () => {
  if (!canvasWidth.value) {
    return
  }

  const context = createCanvasContext()
  context.clearRect(0, 0, canvasWidth.value, chartHeightPx.value)
  context.draw()
}

const createChartOptions = () => ({
  canvasId,
  type: props.config.type,
  context: createCanvasContext(),
  width: canvasWidth.value,
  height: chartHeightPx.value,
  pixelRatio: uni.getSystemInfoSync().pixelRatio,
  background: '#FFFFFF',
  animation: false,
  categories: props.config.categories ?? [],
  series: props.config.series ?? [],
  extra: props.config.extra ?? {},
  legend: props.config.legend,
  xAxis: props.config.xAxis,
  yAxis: props.config.yAxis,
  color: props.config.color,
  padding: props.config.padding ?? [12, 12, 12, 12],
  dataLabel: props.config.dataLabel ?? true,
  enableScroll: props.config.enableScroll ?? false,
  fontSize: props.config.fontSize ?? 11,
  fontColor: props.config.fontColor ?? '#666666',
})

const renderChart = async () => {
  renderVersion += 1
  const currentVersion = renderVersion

  if (props.empty) {
    clearCanvas()
    chart = null
    return
  }

  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 50))
  const width = await getCanvasWidth()
  if (!width || currentVersion !== renderVersion) {
    return
  }

  canvasWidth.value = width
  clearCanvas()

  if (chart && chart.opts?.type === props.config.type) {
    chart.updateData(createChartOptions())
    return
  }

  chart?.stopAnimation?.()
  chart = new UCharts(createChartOptions())
}

watch(
  () => [props.config, props.height, props.empty],
  () => {
    renderChart()
  },
  { deep: true },
)

onReady(() => {
  renderChart()
})

onBeforeUnmount(() => {
  chart?.stopAnimation?.()
  chart = null
})
</script>

<style scoped lang="scss">
.chart-card {
  padding: 24rpx;
}

.chart-card__title {
  margin-bottom: 22rpx;
  font-size: 30rpx;
  font-weight: 700;
}

.chart-card__canvas {
  display: block;
  width: 100%;
}

.chart-card__fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 320rpx;
  border-radius: 24rpx;
  background: var(--color-primary-light, #f7f2ff);
}

.chart-card__fallback-text {
  font-size: 26rpx;
  color: var(--color-text-muted, #8b8ba0);
}
</style>
