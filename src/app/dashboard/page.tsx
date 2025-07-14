'use client'

import { useAuthContext } from '@/components/providers/auth-provider'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Clock, Activity, Settings, LogOut, Shield } from 'lucide-react'
import { toast } from 'sonner'

/**
 * 仪表板页面
 * 这是一个受保护的页面，只有登录用户才能访问
 */
export default function DashboardPage() {
  const { user, signOut, isLoading } = useAuthContext()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('已成功登出')
    } catch (error) {
      toast.error('登出失败，请重试')
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
          <p className='text-muted-foreground'>加载中...</p>
        </div>
      </div>
    )
  }

  // 如果用户未登录，显示未授权页面
  if (!user) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center space-y-6 max-w-md mx-auto px-4'>
          <Shield className='h-16 w-16 text-muted-foreground mx-auto' />
          <div className='space-y-2'>
            <h1 className='text-2xl font-bold text-foreground'>访问受限</h1>
            <p className='text-muted-foreground'>
              您需要登录才能访问此页面。请先登录您的账户。
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Button asChild>
              <a href='/login'>立即登录</a>
            </Button>
            <Button variant='outline' asChild>
              <a href='/register'>创建账户</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* 页面头部 */}
      <header className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <Shield className='h-8 w-8 text-primary' />
              <div>
                <h1 className='text-2xl font-bold text-foreground'>仪表板</h1>
                <p className='text-sm text-muted-foreground'>
                  欢迎回来，{user?.name || user?.email}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <Badge
                variant='secondary'
                className='flex items-center space-x-1'
              >
                <User className='h-3 w-3' />
                <span>{user?.name}</span>
              </Badge>
              <Button variant='outline' size='sm' onClick={handleSignOut}>
                <LogOut className='h-4 w-4 mr-2' />
                登出
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className='container mx-auto px-4 py-8'>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* 用户信息卡片 */}
          <Card className='bg-card border-border'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2 text-foreground'>
                <User className='h-5 w-5' />
                <span>用户信息</span>
              </CardTitle>
              <CardDescription>您的账户详细信息</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>用户ID:</span>
                  <span className='text-sm font-mono text-foreground'>
                    {user?.id.slice(0, 8)}...
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-sm text-muted-foreground'>邮箱:</span>
                  <span className='text-sm text-foreground'>{user?.email}</span>
                </div>
                {user?.name && (
                  <div className='flex justify-between'>
                    <span className='text-sm text-muted-foreground'>姓名:</span>
                    <span className='text-sm text-foreground'>{user.name}</span>
                  </div>
                )}
              </div>
              <Separator />
              <Button variant='outline' size='sm' className='w-full'>
                <Settings className='h-4 w-4 mr-2' />
                编辑资料
              </Button>
            </CardContent>
          </Card>

          {/* 账户状态卡片 */}
          <Card className='bg-card border-border'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2 text-foreground'>
                <Activity className='h-5 w-5' />
                <span>账户状态</span>
              </CardTitle>
              <CardDescription>您的账户活动概览</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    账户状态
                  </span>
                  <Badge
                    variant='default'
                    className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  >
                    活跃
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    邮箱验证
                  </span>
                  <Badge
                    variant='default'
                    className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  >
                    已验证
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>
                    安全等级
                  </span>
                  <Badge variant='secondary'>标准</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 最近活动卡片 */}
          <Card className='bg-card border-border'>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2 text-foreground'>
                <Clock className='h-5 w-5' />
                <span>最近活动</span>
              </CardTitle>
              <CardDescription>您的最近登录记录</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <div className='flex-1'>
                    <p className='text-sm text-foreground'>当前会话</p>
                    <p className='text-xs text-muted-foreground'>刚刚登录</p>
                  </div>
                </div>
                {user?.created_at && (
                  <div className='flex items-center space-x-3'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                    <div className='flex-1'>
                      <p className='text-sm text-foreground'>账户创建</p>
                      <p className='text-xs text-muted-foreground'>
                        {new Date(user.created_at).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 快速操作区域 */}
        <div className='mt-8'>
          <Card className='bg-card border-border'>
            <CardHeader>
              <CardTitle className='text-foreground'>快速操作</CardTitle>
              <CardDescription>常用功能快速访问</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Button variant='outline' className='h-20 flex-col space-y-2'>
                  <User className='h-6 w-6' />
                  <span>个人资料</span>
                </Button>
                <Button variant='outline' className='h-20 flex-col space-y-2'>
                  <Settings className='h-6 w-6' />
                  <span>账户设置</span>
                </Button>
                <Button variant='outline' className='h-20 flex-col space-y-2'>
                  <Shield className='h-6 w-6' />
                  <span>安全设置</span>
                </Button>
                <Button variant='outline' className='h-20 flex-col space-y-2'>
                  <Activity className='h-6 w-6' />
                  <span>活动日志</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
