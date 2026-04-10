export const mainTabs = [
  { key: 'home', label: '首页', icon: '/static/home.png', activeIcon: '/static/home_active.png', path: '/pages/index/index' },
  { key: 'bills', label: '账单', icon: '/static/bills.png', activeIcon: '/static/bills_active.png', path: '/pages/bills/index' },
  { key: 'stats', label: '统计', icon: '/static/stats.png', activeIcon: '/static/stats_active.png', path: '/pages/stats/index' },
  { key: 'profile', label: '我的', icon: '/static/profile.png', activeIcon: '/static/profile_active.png', path: '/pages/profile/index' },
] as const

export type MainTabKey = (typeof mainTabs)[number]['key']
