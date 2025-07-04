/**
 * Zustand状态管理演示
 * 根据.traerc.json规则：使用TypeScript严格类型，模块化设计
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// 定义状态类型
interface DemoState {
  // 计数器状态
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
  
  // 用户信息状态
  user: {
    name: string
    email: string
  } | null
  setUser: (user: { name: string; email: string }) => void
  clearUser: () => void
  
  // 主题状态
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // 通知状态
  notifications: Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    timestamp: number
  }>
  addNotification: (notification: Omit<DemoState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

// 创建Zustand store
export const useDemoStore = create<DemoState>()
  (devtools(
    persist(
      immer((set, get) => ({
        // 计数器初始状态和操作
        count: 0,
        increment: () => set((state) => {
          state.count += 1
        }),
        decrement: () => set((state) => {
          state.count -= 1
        }),
        reset: () => set((state) => {
          state.count = 0
        }),
        
        // 用户信息初始状态和操作
        user: null,
        setUser: (user) => set((state) => {
          state.user = user
        }),
        clearUser: () => set((state) => {
          state.user = null
        }),
        
        // 主题初始状态和操作
        theme: 'system',
        setTheme: (theme) => set((state) => {
          state.theme = theme
        }),
        
        // 通知初始状态和操作
        notifications: [],
        addNotification: (notification) => set((state) => {
          const newNotification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now()
          }
          state.notifications.push(newNotification)
        }),
        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id)
        }),
        clearNotifications: () => set((state) => {
          state.notifications = []
        })
      })),
      {
        name: 'demo-store', // 持久化存储的key
        partialize: (state) => ({
          count: state.count,
          user: state.user,
          theme: state.theme
        }) // 只持久化部分状态
      }
    ),
    {
      name: 'demo-store' // DevTools中显示的名称
    }
  ))

// 选择器hooks（可选，用于性能优化）
export const useCount = () => useDemoStore((state) => state.count)
export const useUser = () => useDemoStore((state) => state.user)
export const useTheme = () => useDemoStore((state) => state.theme)
export const useNotifications = () => useDemoStore((state) => state.notifications)

// 操作hooks（可选，用于更好的组织）
export const useCountActions = () => {
  const increment = useDemoStore((state) => state.increment)
  const decrement = useDemoStore((state) => state.decrement)
  const reset = useDemoStore((state) => state.reset)
  return { increment, decrement, reset }
}

export const useUserActions = () => {
  const setUser = useDemoStore((state) => state.setUser)
  const clearUser = useDemoStore((state) => state.clearUser)
  return { setUser, clearUser }
}

export const useThemeActions = () => {
  const setTheme = useDemoStore((state) => state.setTheme)
  return { setTheme }
}

export const useNotificationActions = () => {
  const addNotification = useDemoStore((state) => state.addNotification)
  const removeNotification = useDemoStore((state) => state.removeNotification)
  const clearNotifications = useDemoStore((state) => state.clearNotifications)
  return { addNotification, removeNotification, clearNotifications }
}