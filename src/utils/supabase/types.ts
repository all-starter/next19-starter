import type { User } from '@supabase/supabase-js'

/**
 * 认证用户类型
 */
export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

/**
 * 登录表单数据类型
 */
export interface LoginFormData {
  email: string
  password: string
}

/**
 * 注册表单数据类型
 */
export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

/**
 * 认证错误类型
 */
export interface AuthError {
  code: string
  message: string
  type: 'validation' | 'auth' | 'network' | 'unknown'
}

/**
 * 认证状态类型
 */
export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
}

/**
 * 会话状态类型
 */
export interface SessionState {
  user: AuthUser | null
  session: any | null
  isLoading: boolean
}

/**
 * 密码验证结果类型
 */
export interface PasswordValidation {
  isValid: boolean
  message: string
}

/**
 * 转换 Supabase 用户为应用用户类型
 */
export function transformUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name || user.user_metadata?.full_name,
    avatar_url: user.user_metadata?.avatar_url,
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
  }
}

/**
 * 转换认证错误
 */
export function transformAuthError(error: any): AuthError {
  if (!error) {
    return {
      code: 'unknown',
      message: '未知错误',
      type: 'unknown',
    }
  }

  // Supabase 错误处理
  if (error.message) {
    const message = error.message.toLowerCase()

    if (message.includes('invalid login credentials')) {
      return {
        code: 'invalid_credentials',
        message: '邮箱或密码错误',
        type: 'auth',
      }
    }

    if (message.includes('email not confirmed')) {
      return {
        code: 'email_not_confirmed',
        message: '请先验证邮箱',
        type: 'auth',
      }
    }

    if (message.includes('user already registered')) {
      return {
        code: 'user_exists',
        message: '该邮箱已被注册',
        type: 'auth',
      }
    }

    if (message.includes('password')) {
      return {
        code: 'weak_password',
        message: '密码强度不够',
        type: 'validation',
      }
    }

    if (message.includes('network')) {
      return {
        code: 'network_error',
        message: '网络连接错误',
        type: 'network',
      }
    }
  }

  return {
    code: error.code || 'unknown',
    message: error.message || '操作失败',
    type: 'unknown',
  }
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证密码强度
 */
export function validatePassword(password: string): PasswordValidation {
  if (!password) {
    return {
      isValid: false,
      message: '请输入密码',
    }
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: '密码至少需要6个字符',
    }
  }

  if (password.length > 128) {
    return {
      isValid: false,
      message: '密码不能超过128个字符',
    }
  }

  // 检查是否包含至少一个字母和一个数字
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      message: '密码必须包含至少一个字母和一个数字',
    }
  }

  return {
    isValid: true,
    message: '密码格式正确',
  }
}

/**
 * 生成用户显示名称
 */
export function getUserDisplayName(user: AuthUser): string {
  return user.name || user.email.split('@')[0]
}

/**
 * 获取用户头像信息
 */
export function getUserAvatarInfo(user: AuthUser) {
  return {
    url: user.avatar_url,
    fallback: getUserDisplayName(user).charAt(0).toUpperCase(),
  }
}

/**
 * 检查用户资料是否完整
 */
export function isProfileComplete(user: AuthUser): boolean {
  return !!(user.name && user.email)
}

/**
 * 格式化加入时间
 */
export function formatJoinDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
  })
}

/**
 * 获取安全的重定向URL
 */
export function getSafeRedirectUrl(url?: string): string {
  if (!url) return '/'

  // 只允许相对路径
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url
  }

  // 如果在客户端环境，允许同域名的完整URL
  if (typeof window !== 'undefined') {
    try {
      const urlObj = new URL(url, window.location.origin)
      if (urlObj.origin === window.location.origin) {
        return urlObj.pathname + urlObj.search + urlObj.hash
      }
    } catch {
      // URL解析失败，返回默认路径
    }
  }

  return '/'
}
