'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { createClient } from '@/utils/supabase/client'
import type {
  AuthUser,
  LoginFormData,
  RegisterFormData,
  AuthError,
} from '@/utils/supabase/types'
import {
  transformAuthError,
  transformUser,
  isValidEmail,
  validatePassword,
} from '@/utils/supabase/types'
import { toast } from 'sonner'

/**
 * 认证上下文类型定义
 */
interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  error: AuthError | null
  login: (
    data: LoginFormData
  ) => Promise<{ success: boolean; error?: AuthError }>
  register: (
    data: RegisterFormData
  ) => Promise<{ success: boolean; error?: AuthError }>
  signOut: () => Promise<{ success: boolean; error?: AuthError }>
  refreshUser: () => Promise<void>
}

/**
 * 认证上下文
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * 认证提供者组件属性
 */
interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * 认证状态类型定义
 */
interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: AuthError | null
}

/**
 * 认证提供者组件
 * 为整个应用提供认证状态管理
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const supabase = createClient()
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        const authError = transformAuthError(sessionError)
        console.error('获取会话失败:', sessionError)
        setError(authError)
        setUser(null)
        return
      }

      if (session?.user) {
        const authUser = transformUser(session.user)
        setUser(authUser)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('会话检查错误:', err)
      const authError = transformAuthError(err as Error)
      setError(authError)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 用户登录
   */
  const login = useCallback(async (data: LoginFormData) => {
    // 客户端验证
    if (!isValidEmail(data.email)) {
      const authError: AuthError = {
        code: 'invalid_email',
        message: '请输入有效的邮箱地址',
        type: 'validation',
      }
      setError(authError)
      toast.error(authError.message)
      return { success: false, error: authError }
    }

    const passwordValidation = validatePassword(data.password)
    if (!passwordValidation.isValid) {
      const authError: AuthError = {
        code: 'invalid_password',
        message: passwordValidation.message,
        type: 'validation',
      }
      setError(authError)
      toast.error(authError.message)
      return { success: false, error: authError }
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        const authError = transformAuthError(signInError)
        setError(authError)
        toast.error(authError.message)
        return { success: false, error: authError }
      }

      toast.success('登录成功')
      return { success: true }
    } catch (err) {
      const authError = transformAuthError(err as Error)
      setError(authError)
      toast.error(authError.message)
      return { success: false, error: authError }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 用户注册
   */
  const register = useCallback(async (data: RegisterFormData) => {
    // 客户端验证
    if (!data.nickname?.trim()) {
      const authError: AuthError = {
        code: 'invalid_name',
        message: '请输入用户名',
        type: 'validation',
      }
      setError(authError)
      toast.error(authError.message)
      return { success: false, error: authError }
    }

    if (!isValidEmail(data.email)) {
      const authError: AuthError = {
        code: 'invalid_email',
        message: '请输入有效的邮箱地址',
        type: 'validation',
      }
      setError(authError)
      toast.error(authError.message)
      return { success: false, error: authError }
    }

    const passwordValidation = validatePassword(data.password)
    if (!passwordValidation.isValid) {
      const authError: AuthError = {
        code: 'invalid_password',
        message: passwordValidation.message,
        type: 'validation',
      }
      setError(authError)
      toast.error(authError.message)
      return { success: false, error: authError }
    }

    if (data.password !== data.confirmPassword) {
      const authError: AuthError = {
        code: 'password_mismatch',
        message: '两次输入的密码不一致',
        type: 'validation',
      }
      setError(authError)
      toast.error(authError.message)
      return { success: false, error: authError }
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // 检查邮箱是否已注册
      const { data: existingUser, error: existingError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', data.email)

      if (existingError) {
        const authError = transformAuthError(existingError)
        setError(authError)
        toast.error(authError.message)
        return { success: false, error: authError }
      }

      if (existingUser && existingUser.length > 0) {
        const authError: AuthError = {
          code: 'email_already_in_use',
          message: '该邮箱已被注册',
          type: 'validation',
        }
        setError(authError)
        toast.error(authError.message)
        return { success: false, error: authError }
      }

      // 注册新用户
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              nickname: data.nickname,
            },
          },
        })

      if (signUpError) {
        const authError = transformAuthError(signUpError)
        setError(authError)
        toast.error(authError.message)
        return { success: false, error: authError }
      }

      // 注册成功保存用户信息
      if (signUpData && signUpData.user) {
        // 保存用户信息到数据库
        const { error: dbError } = await supabase
          .from('profiles')
          .upsert({
            id: signUpData.user?.id,
            email: signUpData.user?.email,
            nickname: signUpData.user.user_metadata.nickname,
          })
          .select()
          .single()

        if (dbError) {
          console.error('数据库保存错误:', dbError)
          const authError = transformAuthError(dbError)
          setError(authError)
          toast.error(authError.message)
          return { success: false, error: authError }
        }
      }

      toast.success('注册成功，请检查邮箱验证链接')
      return { success: true }
    } catch (err) {
      const authError = transformAuthError(err as Error)
      setError(authError)
      toast.error(authError.message)
      return { success: false, error: authError }
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 用户登出
   */
  const signOut = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        const authError = transformAuthError(signOutError)
        setError(authError)
        toast.error(authError.message)
        return { success: false, error: authError }
      }

      setUser(null)
      toast.success('已成功登出')
      return { success: true }
    } catch (err) {
      const authError = transformAuthError(err as Error)
      setError(authError)
      toast.error(authError.message)
      return { success: false, error: authError }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // 初始化时获取用户信息
    refreshUser()

    // 监听认证状态变化
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const authUser = transformUser(session.user)
        setUser(authUser)
        setIsLoading(false)
        setError(null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsLoading(false)
        setError(null)
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // 令牌刷新时更新用户信息
        const authUser = transformUser(session.user)
        setUser(authUser)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshUser])

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * 使用认证上下文的 Hook
 */
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
