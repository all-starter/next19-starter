'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { AuthState } from '@/utils/supabase/types'

/**
 * 认证上下文类型定义
 */
interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
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
 * 认证提供者组件
 * 为整个应用提供认证状态管理
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  /**
   * 刷新用户信息
   */
  const refreshUser = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        setAuthState({
          user: null,
          isLoading: false,
          error: error.message,
        })
        return
      }

      setAuthState({
        user: user
          ? {
              id: user.id,
              email: user.email!,
              nickname: user.user_metadata?.name,
              avatar_url: user.user_metadata?.avatar_url,
              created_at: user.created_at,
              updated_at: user.updated_at || user.created_at,
            }
          : null,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : '获取用户信息失败',
      })
    }
  }

  /**
   * 用户登出
   */
  const signOut = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('登出失败:', error.message)
      }
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  useEffect(() => {
    // 初始化时获取用户信息
    refreshUser()

    // 监听认证状态变化
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setAuthState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            nickname: session.user.user_metadata?.name,
            avatar_url: session.user.user_metadata?.avatar_url,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at,
          },
          isLoading: false,
          error: null,
        })
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          isLoading: false,
          error: null,
        })
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // 令牌刷新时更新用户信息
        setAuthState((prev: AuthState) => ({
          ...prev,
          user: prev.user
            ? {
                ...prev.user,
                updated_at: new Date().toISOString(),
              }
            : null,
        }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    ...authState,
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
