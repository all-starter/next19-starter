/**
 * 工具函数集合
 * 工具函数使用camelCase命名，优先使用箭头函数
 */

import { format, parseISO, isValid } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { ApiError } from '@/types/api'
import { VALIDATION } from '@/constants/app'

/**
 * 格式化错误消息
 * @param error - 错误对象
 * @returns 格式化后的错误消息
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as ApiError).message)
  }
  return '未知错误'
}

/**
 * 验证邮箱格式
 * @param email - 邮箱地址
 * @returns 是否为有效邮箱
 */
export const isValidEmail = (email: string): boolean => {
  return VALIDATION.EMAIL_PATTERN.test(email)
}

/**
 * 验证用户名
 * @param name - 用户名
 * @returns 是否为有效用户名
 */
export const isValidName = (name: string): boolean => {
  return name.trim().length >= VALIDATION.MIN_NAME_LENGTH
}

/**
 * 格式化时间戳
 * @param timestamp - ISO时间戳
 * @returns 格式化后的时间字符串
 */
export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp)
    if (!isValid(date)) {
      return timestamp
    }
    return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: zhCN })
  } catch {
    return timestamp
  }
}

/**
 * 格式化相对时间
 * @param timestamp - ISO时间戳
 * @returns 相对时间字符串
 */
export const formatRelativeTime = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp)
    if (!isValid(date)) {
      return timestamp
    }
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) {
      return '刚刚'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`
    } else if (diffInDays < 7) {
      return `${diffInDays}天前`
    } else {
      return format(date, 'yyyy-MM-dd', { locale: zhCN })
    }
  } catch {
    return timestamp
  }
}

/**
 * 获取当前时间戳
 * @returns ISO格式的时间戳字符串
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString()
}

/**
 * 防抖函数
 * @param func - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * 生成随机ID
 * @returns 随机ID字符串
 */
export const generateId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}

/**
 * 检查是否为数组
 * @param data - 要检查的数据
 * @returns 是否为数组
 */
export const isArray = (data: unknown): data is unknown[] => {
  return Array.isArray(data)
}

/**
 * 安全的JSON解析
 * @param jsonString - JSON字符串
 * @returns 解析结果或null
 */
export const safeJsonParse = <T = unknown>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString) as T
  } catch {
    return null
  }
}
