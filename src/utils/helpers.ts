/**
 * 工具函数集合
 * 根据.traerc.json规则：工具函数使用camelCase命名，优先使用箭头函数
 */

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
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return timestamp
  }
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
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
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