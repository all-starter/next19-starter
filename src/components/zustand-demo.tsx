'use client'

/**
 * Zustand状态管理演示组件
 * 使用TypeScript严格类型，组件分离，错误处理
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useCount,
  useUser,
  useNotifications,
  useCountActions,
  useUserActions,
  useNotificationActions,
} from '@/store/demo-store'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  Trash2,
  Plus,
  Minus,
  RotateCcw,
  User,
  Bell,
  Clock,
  Link,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { formatRelativeTime } from '@/utils/helpers'
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs'

export function ZustandDemo() {
  // 使用选择器hooks获取状态
  const count = useCount()
  const user = useUser()
  const notifications = useNotifications()

  // 使用操作hooks获取操作函数
  const { increment, decrement, reset } = useCountActions()
  const { setUser, clearUser } = useUserActions()
  const { addNotification, removeNotification, clearNotifications } =
    useNotificationActions()

  // nuqs URL状态管理
  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('')
  )
  const [pageNumber, setPageNumber] = useQueryState(
    'page',
    parseAsInteger.withDefault(1)
  )
  const [category, setCategory] = useQueryState(
    'category',
    parseAsString.withDefault('all')
  )

  // 本地表单状态
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const handleSetUser = () => {
    if (userName.trim() && userEmail.trim()) {
      setUser({ name: userName.trim(), email: userEmail.trim() })
      setUserName('')
      setUserEmail('')
      toast.success('用户信息已保存到Zustand store！')
    } else {
      toast.error('请填写完整的用户信息')
    }
  }

  const handleAddNotification = (
    type: 'success' | 'error' | 'warning' | 'info'
  ) => {
    const messages = {
      success: '这是一个成功通知',
      error: '这是一个错误通知',
      warning: '这是一个警告通知',
      info: '这是一个信息通知',
    }

    addNotification({
      message: messages[type],
      type,
    })

    toast.success('通知已添加到store！')
  }

  return (
    <div className='space-y-6 p-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold mb-2'>Zustand 状态管理演示</h1>
        <p className='text-muted-foreground'>
          展示Zustand的状态管理、持久化存储和DevTools集成
        </p>
      </div>

      {/* nuqs URL状态管理演示 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Link className='h-5 w-5' />
            nuqs URL状态管理
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='searchInput'>搜索查询</Label>
              <Input
                id='searchInput'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='输入搜索内容'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='pageInput'>页码</Label>
              <Input
                id='pageInput'
                type='number'
                value={pageNumber}
                onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
                min='1'
                placeholder='页码'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='categorySelect'>分类</Label>
              <select
                id='categorySelect'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white'
              >
                <option value='all'>全部</option>
                <option value='tech'>技术</option>
                <option value='design'>设计</option>
                <option value='business'>商业</option>
              </select>
            </div>
          </div>

          <div className='p-4 bg-muted rounded-lg'>
            <h4 className='font-medium mb-2'>当前URL参数:</h4>
            <div className='space-y-1 text-sm font-mono'>
              <p>
                search:{' '}
                <span className='text-primary'>{searchQuery || '(空)'}</span>
              </p>
              <p>
                page: <span className='text-primary'>{pageNumber}</span>
              </p>
              <p>
                category: <span className='text-primary'>{category}</span>
              </p>
            </div>
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setSearchQuery('React')
                setPageNumber(2)
                setCategory('tech')
              }}
              size='sm'
            >
              设置示例参数
            </Button>
            <Button
              onClick={() => {
                setSearchQuery('')
                setPageNumber(1)
                setCategory('all')
              }}
              variant='outline'
              size='sm'
            >
              重置参数
            </Button>
          </div>

          <Alert>
            <AlertDescription>
              nuqs会自动将状态同步到URL查询参数中，支持浏览器前进/后退，页面刷新后状态会保持。
              查看浏览器地址栏的变化！
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 计数器演示 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Plus className='h-5 w-5' />
            计数器状态管理
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-center'>
            <div className='text-4xl font-bold text-primary mb-4'>{count}</div>
            <div className='flex justify-center gap-2'>
              <Button onClick={increment} size='sm'>
                <Plus className='h-4 w-4' />
                增加
              </Button>
              <Button onClick={decrement} variant='outline' size='sm'>
                <Minus className='h-4 w-4' />
                减少
              </Button>
              <Button onClick={reset} variant='destructive' size='sm'>
                <RotateCcw className='h-4 w-4' />
                重置
              </Button>
            </div>
          </div>
          <Alert>
            <AlertDescription>
              计数器状态会自动持久化到localStorage，刷新页面后数值会保持。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 用户信息演示 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <User className='h-5 w-5' />
            用户信息管理
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {user ? (
            <div className='space-y-3'>
              <div className='p-4 bg-muted rounded-lg'>
                <p className='font-medium'>{user.name}</p>
                <p className='text-sm text-muted-foreground'>{user.email}</p>
              </div>
              <Button onClick={clearUser} variant='outline' size='sm'>
                清除用户信息
              </Button>
            </div>
          ) : (
            <div className='space-y-3'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='space-y-2'>
                  <Label htmlFor='userName'>用户名</Label>
                  <Input
                    id='userName'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder='输入用户名'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='userEmail'>邮箱</Label>
                  <Input
                    id='userEmail'
                    type='email'
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder='输入邮箱'
                  />
                </div>
              </div>
              <Button onClick={handleSetUser} size='sm'>
                保存用户信息
              </Button>
            </div>
          )}
          <Alert>
            <AlertDescription>
              用户信息也会持久化存储，刷新页面后会自动恢复。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 主题管理演示 */}
      <Card>
        <CardHeader>
          <CardTitle>主题管理</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-4'>
            <ThemeToggle />
            <span className='text-sm text-muted-foreground'>
              使用下拉菜单选择主题
            </span>
          </div>
          <Alert>
            <AlertDescription>
              主题切换会立即应用到整个应用，包括所有组件和页面。选择"系统"会跟随操作系统的主题设置。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 通知管理演示 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Bell className='h-5 w-5' />
            通知管理 ({notifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex flex-wrap gap-2'>
            <Button
              onClick={() => handleAddNotification('success')}
              variant='outline'
              size='sm'
            >
              添加成功通知
            </Button>
            <Button
              onClick={() => handleAddNotification('error')}
              variant='outline'
              size='sm'
            >
              添加错误通知
            </Button>
            <Button
              onClick={() => handleAddNotification('warning')}
              variant='outline'
              size='sm'
            >
              添加警告通知
            </Button>
            <Button
              onClick={() => handleAddNotification('info')}
              variant='outline'
              size='sm'
            >
              添加信息通知
            </Button>
            {notifications.length > 0 && (
              <Button
                onClick={clearNotifications}
                variant='destructive'
                size='sm'
              >
                <Trash2 className='h-4 w-4' />
                清空所有
              </Button>
            )}
          </div>

          {notifications.length > 0 && (
            <div className='space-y-2 max-h-60 overflow-y-auto'>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className='flex items-center justify-between p-3 border rounded-lg'
                >
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant={
                          notification.type === 'success'
                            ? 'default'
                            : notification.type === 'error'
                              ? 'destructive'
                              : notification.type === 'warning'
                                ? 'secondary'
                                : 'outline'
                        }
                      >
                        {notification.type}
                      </Badge>
                      <span className='text-sm'>{notification.message}</span>
                    </div>
                    <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                      <Clock className='h-3 w-3' />
                      <span>{formatRelativeTime(notification.timestamp)}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeNotification(notification.id)}
                    variant='ghost'
                    size='sm'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Alert>
            <AlertDescription>
              通知状态不会持久化，刷新页面后会清空。这演示了选择性持久化的功能。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 开发者工具提示 */}
      <Card>
        <CardHeader>
          <CardTitle>开发者工具</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              打开浏览器开发者工具，在Redux DevTools扩展中可以看到"demo-store"，
              可以实时查看状态变化、时间旅行调试等功能。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
