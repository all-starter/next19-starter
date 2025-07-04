'use client'

/**
 * Zustand状态管理演示组件
 * 根据.traerc.json规则：使用TypeScript严格类型，组件分离，错误处理
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
  useTheme, 
  useNotifications,
  useCountActions,
  useUserActions,
  useThemeActions,
  useNotificationActions
} from '@/store/demo-store'
import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2, Plus, Minus, RotateCcw, User, Bell } from 'lucide-react'

export function ZustandDemo() {
  // 使用选择器hooks获取状态
  const count = useCount()
  const user = useUser()
  const theme = useTheme()
  const notifications = useNotifications()
  
  // 使用操作hooks获取操作函数
  const { increment, decrement, reset } = useCountActions()
  const { setUser, clearUser } = useUserActions()
  const { setTheme } = useThemeActions()
  const { addNotification, removeNotification, clearNotifications } = useNotificationActions()
  
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

  const handleAddNotification = (type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: '这是一个成功通知',
      error: '这是一个错误通知',
      warning: '这是一个警告通知',
      info: '这是一个信息通知'
    }
    
    addNotification({
      message: messages[type],
      type
    })
    
    toast.success('通知已添加到store！')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Zustand 状态管理演示</h1>
        <p className="text-muted-foreground">
          展示Zustand的状态管理、持久化存储和DevTools集成
        </p>
      </div>

      {/* 计数器演示 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            计数器状态管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-4">{count}</div>
            <div className="flex justify-center gap-2">
              <Button onClick={increment} size="sm">
                <Plus className="h-4 w-4" />
                增加
              </Button>
              <Button onClick={decrement} variant="outline" size="sm">
                <Minus className="h-4 w-4" />
                减少
              </Button>
              <Button onClick={reset} variant="destructive" size="sm">
                <RotateCcw className="h-4 w-4" />
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
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            用户信息管理
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button onClick={clearUser} variant="outline" size="sm">
                清除用户信息
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="userName">用户名</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="输入用户名"
                  />
                </div>
                <div>
                  <Label htmlFor="userEmail">邮箱</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="输入邮箱"
                  />
                </div>
              </div>
              <Button onClick={handleSetUser} size="sm">
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
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((themeOption) => (
              <Button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                variant={theme === themeOption ? 'default' : 'outline'}
                size="sm"
              >
                {themeOption === 'light' && '☀️ 浅色'}
                {themeOption === 'dark' && '🌙 深色'}
                {themeOption === 'system' && '💻 系统'}
              </Button>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            当前主题: <Badge variant="secondary">{theme}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 通知管理演示 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            通知管理 ({notifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => handleAddNotification('success')} 
              variant="outline" 
              size="sm"
            >
              添加成功通知
            </Button>
            <Button 
              onClick={() => handleAddNotification('error')} 
              variant="outline" 
              size="sm"
            >
              添加错误通知
            </Button>
            <Button 
              onClick={() => handleAddNotification('warning')} 
              variant="outline" 
              size="sm"
            >
              添加警告通知
            </Button>
            <Button 
              onClick={() => handleAddNotification('info')} 
              variant="outline" 
              size="sm"
            >
              添加信息通知
            </Button>
            {notifications.length > 0 && (
              <Button 
                onClick={clearNotifications} 
                variant="destructive" 
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
                清空所有
              </Button>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        notification.type === 'success' ? 'default' :
                        notification.type === 'error' ? 'destructive' :
                        notification.type === 'warning' ? 'secondary' : 'outline'
                      }
                    >
                      {notification.type}
                    </Badge>
                    <span className="text-sm">{notification.message}</span>
                  </div>
                  <Button 
                    onClick={() => removeNotification(notification.id)}
                    variant="ghost" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
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