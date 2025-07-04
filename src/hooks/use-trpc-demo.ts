/**
 * tRPC演示相关的自定义hooks
 * 使用React Query优化，处理加载和错误状态
 */

import { useState, useCallback } from 'react'
import { trpc } from '@/utils/trpc'
import type { CreateUserInput, FormState } from '@/types/api'
import { RANDOM_NUMBER_DEFAULTS } from '@/constants/app'
import { isValidEmail, isValidName } from '@/utils/helpers'
import { toast } from 'sonner'

/**
 * 管理表单状态的hook
 * 提供表单字段的状态管理和验证功能
 * @returns 包含表单状态、更新函数、重置函数和验证函数的对象
 */
export const useFormState = () => {
  const [formState, setFormState] = useState<FormState>({
    userName: '',
    userEmail: '',
    name: '',
  })

  const updateField = useCallback((field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormState({
      userName: '',
      userEmail: '',
      name: '',
    })
  }, [])

  const isFormValid = useCallback(() => {
    return isValidName(formState.userName) && isValidEmail(formState.userEmail)
  }, [formState.userName, formState.userEmail])

  return {
    formState,
    updateField,
    resetForm,
    isFormValid,
  }
}

/**
 * 管理Hello查询的hook
 * 调用hello API获取问候消息，支持缓存和重试
 * @param name - 用户名参数
 * @returns tRPC查询结果，包含数据、加载状态和错误信息
 */
export const useHelloQuery = (name: string) => {
  return trpc.hello.useQuery(
    { name: name.trim() || undefined },
    {
      enabled: true,
      staleTime: 30 * 1000, // 30秒
      retry: 2,
    }
  )
}

/**
 * 管理用户列表查询的hook
 * 获取所有用户数据，配置了1分钟的缓存时间
 * @returns tRPC查询结果，包含用户列表数据、加载状态和错误信息
 */
export const useUsersQuery = () => {
  return trpc.getUsers.useQuery(undefined, {
    staleTime: 60 * 1000, // 1分钟
    retry: 3,
  })
}

/**
 * 管理随机数查询的hook
 * 获取指定范围内的随机数，每次调用都会重新获取
 * @returns tRPC查询结果，包含随机数数据、加载状态和错误信息
 */
export const useRandomNumberQuery = () => {
  return trpc.getRandomNumber.useQuery(
    {
      min: RANDOM_NUMBER_DEFAULTS.MIN,
      max: RANDOM_NUMBER_DEFAULTS.MAX,
    },
    {
      staleTime: 0, // 总是重新获取
      retry: 2,
    }
  )
}

/**
 * 管理创建用户变更的hook
 * 创建新用户并自动刷新用户列表，提供成功和错误处理
 * @param onSuccess - 创建成功后的回调函数
 * @returns tRPC变更结果，包含mutate函数、加载状态和错误信息
 */
export const useCreateUserMutation = (onSuccess?: () => void) => {
  const utils = trpc.useUtils()

  return trpc.createUser.useMutation({
    onSuccess: (data) => {
      // 重新获取用户列表
      utils.getUsers.invalidate()
      toast.success(`用户 ${data.name} 创建成功！`)
      onSuccess?.()
    },
    onError: (error) => {
      console.error('创建用户失败:', error)
      toast.error(`创建用户失败: ${error.message}`)
    },
    retry: 1,
  })
}

/**
 * 组合所有tRPC相关状态的主hook
 * 整合表单管理、API查询和变更操作，提供完整的演示功能
 * @returns 包含所有状态、查询结果和操作函数的对象
 */
export const useTRPCDemo = () => {
  const { formState, updateField, resetForm, isFormValid } = useFormState()

  const helloQuery = useHelloQuery(formState.name)
  const usersQuery = useUsersQuery()
  const randomNumberQuery = useRandomNumberQuery()

  const createUserMutation = useCreateUserMutation(() => {
    resetForm()
  })

  const handleCreateUser = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (isFormValid()) {
        const input: CreateUserInput = {
          name: formState.userName,
          email: formState.userEmail,
        }
        createUserMutation.mutate(input)
      }
    },
    [formState.userName, formState.userEmail, isFormValid, createUserMutation]
  )

  const refreshRandomNumber = useCallback(() => {
    randomNumberQuery.refetch()
  }, [randomNumberQuery])

  return {
    // 表单状态
    formState,
    updateField,
    isFormValid,

    // 查询状态
    helloQuery,
    usersQuery,
    randomNumberQuery,

    // 变更状态
    createUserMutation,

    // 操作函数
    handleCreateUser,
    refreshRandomNumber,
  }
}
