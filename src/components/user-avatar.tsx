'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthContext } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, Settings, LayoutDashboard } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

/**
 * 用户头像组件
 * 显示用户信息和提供登出功能
 */
export function UserAvatar() {
  const { user, signOut, isLoading } = useAuthContext()
  const [isSigningOut, setIsSigningOut] = useState(false)

  /**
   * 处理登出
   */
  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      toast.success('已成功登出')
    } catch (error) {
      toast.error('登出失败，请重试')
    } finally {
      setIsSigningOut(false)
    }
  }

  // 如果正在加载或用户未登录，显示登录按钮
  if (isLoading) {
    return (
      <div className='flex items-center space-x-2'>
        <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse' />
      </div>
    )
  }

  if (!user) {
    return (
      <div className='flex items-center space-x-2'>
        <Button variant='ghost' asChild>
          <Link href='/login'>登录</Link>
        </Button>
        <Button asChild>
          <Link href='/register'>注册</Link>
        </Button>
      </div>
    )
  }

  // 获取用户名首字母作为头像
  const getInitials = (name?: string) => {
    if (!name) return user.email.charAt(0).toUpperCase()
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative h-8 w-8 px-0 rounded-full cursor-pointer'
          disabled={isSigningOut}
        >
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name || user.email}
              className='h-8 w-8 rounded-full object-cover'
            />
          ) : (
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium'>
              {getInitials(user.name)}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {user.name || '未设置姓名'}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/dashboard' className='cursor-pointer'>
            <LayoutDashboard className='mr-2 h-4 w-4' />
            仪表板
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/profile' className='cursor-pointer'>
            <User className='mr-2 h-4 w-4' />
            个人资料
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/settings' className='cursor-pointer'>
            <Settings className='mr-2 h-4 w-4' />
            设置
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='cursor-pointer'
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className='mr-2 h-4 w-4' />
          {isSigningOut ? '登出中...' : '登出'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
