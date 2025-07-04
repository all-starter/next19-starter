import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并和优化CSS类名的工具函数
 * 结合clsx和tailwind-merge的功能，智能处理条件类名和Tailwind冲突
 * 这是shadcn/ui组件库推荐的类名处理方式
 * @param inputs - 类名值数组，支持字符串、对象、数组等多种格式
 * @returns 合并和优化后的类名字符串
 * @example
 * cn('px-2 py-1', 'px-4') // 返回 'py-1 px-4'
 * cn('text-red-500', { 'text-blue-500': true }) // 返回 'text-blue-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
