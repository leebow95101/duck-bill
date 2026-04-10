import type { ThemeConfig } from '@/types/ledger'

export const themePresets: ThemeConfig[] = [
  {
    key: 'violet',
    name: '默认紫',
    primary: '#7C4DFF',
    primarySoft: '#EFE7FF',
    primaryLight: '#F7F2FF',
    background: '#F7F8FC',
    card: '#FFFFFF',
    cardMuted: '#F9F6FF',
    text: '#18181B',
    textMuted: '#8B8BA0',
    border: '#ECE8F8',
    success: '#00B578',
    danger: '#FF4D57',
    warning: '#F5A524',
    shadow: '0 20rpx 48rpx rgba(124, 77, 255, 0.10)',
  },
  {
    key: 'rose',
    name: '莓果粉',
    primary: '#E85D9B',
    primarySoft: '#FFE7F2',
    primaryLight: '#FFF3F8',
    background: '#FBF8FC',
    card: '#FFFFFF',
    cardMuted: '#FFF5FA',
    text: '#18181B',
    textMuted: '#8B8BA0',
    border: '#F6E3EC',
    success: '#00B578',
    danger: '#FF4D57',
    warning: '#F5A524',
    shadow: '0 20rpx 48rpx rgba(232, 93, 155, 0.12)',
  },
  {
    key: 'ocean',
    name: '海盐蓝',
    primary: '#3D7BFF',
    primarySoft: '#E7EFFF',
    primaryLight: '#F4F7FF',
    background: '#F5F8FF',
    card: '#FFFFFF',
    cardMuted: '#F6F9FF',
    text: '#18181B',
    textMuted: '#8B8BA0',
    border: '#E5EBFA',
    success: '#00B578',
    danger: '#FF4D57',
    warning: '#F5A524',
    shadow: '0 20rpx 48rpx rgba(61, 123, 255, 0.12)',
  },
]

export const defaultThemeKey = 'violet'

export const getThemeByKey = (key?: string) =>
  themePresets.find((item) => item.key === key) ?? themePresets[0]
