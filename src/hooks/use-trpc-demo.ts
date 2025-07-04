/**
 * tRPC演示相关的自定义hooks
 * 根据.traerc.json规则：使用React Query优化，处理加载和错误状态
 */

import { useState, useCallback } from 'react'
import { trpc } from '@/utils/trpc'
import type { CreateUserInput, FormState } from '@/types/api'
import { RANDOM_NUMBER_DEFAULTS } from '@/constants/app'
import { isValidEmail, isValidName } from '@/utils/helpers'
import { toast } from 'sonner'

/**
 * 管理表单状态的hook
 */
export const useFormState = () => {
  const [formState, setFormState] = useState<FormState>({
    userName: '',
    userEmail: '',
    name: '',
  })

  const updateField = useCallback((field: keyof FormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }))
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
 */
export const useUsersQuery = () => {
  return trpc.getUsers.useQuery(undefined, {
    staleTime: 60 * 1000, // 1分钟
    retry: 3,
  })
}

/**
 * 管理随机数查询的hook
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
 */
export const useTRPCDemo = () => {
  const {
    formState,
    updateField,
    resetForm,
    isFormValid,
  } = useFormState()

  const helloQuery = useHelloQuery(formState.name)
  const usersQuery = useUsersQuery()
  const randomNumberQuery = useRandomNumberQuery()

  const createUserMutation = useCreateUserMutation(() => {
    resetForm()
  })

  const handleCreateUser = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid()) {
      const input: CreateUserInput = {
        name: formState.userName,
        email: formState.userEmail,
      }
      createUserMutation.mutate(input)
    }
  }, [formState.userName, formState.userEmail, isFormValid, createUserMutation])

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