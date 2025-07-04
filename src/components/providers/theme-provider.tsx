'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'

/**
 * 主题Provider组件
 * 基于next-themes的主题提供者，支持明暗主题切换
 * 为整个应用提供主题上下文和主题切换功能
 * @param children - 子组件
 * @param props - next-themes的ThemeProvider属性
 * @returns JSX元素
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
