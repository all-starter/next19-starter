'use client'

import { useState, useEffect, useCallback } from 'react'
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
 * 认证相关的自定义 Hook
 * 提供登录、注册、登出等功能
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  /**
   * 获取当前用户会话
   */
  const getSession = useCallback(async () => {
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
        return
      }

      if (session?.user) {
        // 可以在这里从数据库获取额外的用户信息
        // const { data: dbUser } = await supabase
        //   .from('users')
        //   .select('*')
        //   .eq('id', session.user.id)
        //   .single()

        const authUser = transformUser(session.user)
        setUser(authUser)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('会话检查错误:', err)
      const authError = transformAuthError(err as Error)
      setError(authError)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getSession()

    // 监听认证状态变化
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const authUser = transformUser(session.user)
        setUser(authUser)
        setError(null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setError(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [getSession])

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
    if (!data.name?.trim()) {
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
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      })

      if (signUpError) {
        const authError = transformAuthError(signUpError)
        setError(authError)
        toast.error(authError.message)
        return { success: false, error: authError }
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
  const logout = useCallback(async () => {
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

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    getSession,
  }
}
