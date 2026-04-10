export const pad = (value: number) => `${value}`.padStart(2, '0')

export const formatCurrency = (value: number) => {
  const amount = Math.abs(value)
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
}

export const signedCurrency = (value: number) => {
  if (value > 0) {
    return `+ ${formatCurrency(value)}`
  }
  if (value < 0) {
    return `- ${formatCurrency(value)}`
  }
  return formatCurrency(value)
}

export const formatMonthLabel = (month: string) => {
  const [year, rawMonth] = month.split('-')
  return `${year} 年 ${Number(rawMonth)} 月`
}

export const formatDateLabel = (date: string) => {
  const current = new Date(date)
  return `${current.getMonth() + 1} 月 ${current.getDate()} 日`
}

export const formatTimeLabel = (date: string) =>
  new Date(date).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })

export const getMonthKey = (source = new Date()) =>
  `${source.getFullYear()}-${pad(source.getMonth() + 1)}`

export const getTodayKey = (source = new Date()) =>
  `${source.getFullYear()}-${pad(source.getMonth() + 1)}-${pad(source.getDate())}`

export const shiftMonth = (month: string, offset: number) => {
  const [year, rawMonth] = month.split('-').map(Number)
  const current = new Date(year, rawMonth - 1 + offset, 1)
  return getMonthKey(current)
}

export const getMonthRange = (month: string) => {
  const [year, rawMonth] = month.split('-').map(Number)
  const start = new Date(year, rawMonth - 1, 1)
  const end = new Date(year, rawMonth, 0)
  return { start, end }
}

export const isSameMonth = (date: string, month: string) => date.startsWith(month)

export const isSameDay = (date: string, target: string) => date.startsWith(target)

export const clampNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
