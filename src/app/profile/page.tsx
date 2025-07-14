'use client'

import { useState } from 'react'
import { useAuthContext } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Calendar, Edit2, Save, X } from 'lucide-react'
import { toast } from 'sonner'

/**
 * 用户个人资料页面
 */
export default function ProfilePage() {
  const { user, refreshUser } = useAuthContext()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: '', // 这里可以从数据库获取用户的 bio
  })

  /**
   * 处理编辑模式切换
   */
  const handleEditToggle = () => {
    if (isEditing) {
      // 取消编辑，重置表单数据
      setFormData({
        name: user?.name || '',
        bio: '',
      })
    }
    setIsEditing(!isEditing)
  }

  /**
   * 处理表单提交
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 这里应该调用 API 更新用户信息
      // 暂时模拟更新过程
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('个人资料更新成功')
      setIsEditing(false)
      await refreshUser()
    } catch (error) {
      toast.error('更新失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 处理输入变化
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  /**
   * 获取用户显示名称
   */
  const getUserDisplayName = (user: any) => {
    return user?.name || user?.email?.split('@')[0] || '用户'
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>未找到用户信息</h1>
          <p className='text-gray-600 dark:text-gray-400'>
            请重新登录或联系管理员
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background py-6 sm:py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
            个人资料
          </h1>
          <p className='mt-2 text-muted-foreground'>
            管理您的个人信息和账户设置
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
          {/* 用户头像和基本信息 */}
          <div className='lg:col-span-1'>
            <Card className='border-border bg-card'>
              <CardContent className='pt-6'>
                <div className='flex flex-col items-center text-center'>
                  <div className='relative inline-block'>
                    <div className='relative group cursor-pointer' onClick={() => setIsAvatarDialogOpen(true)}>
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name || user.email}
                          className='w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-border transition-opacity group-hover:opacity-75'
                        />
                      ) : (
                        <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl sm:text-2xl font-bold ring-2 ring-border transition-opacity group-hover:opacity-75'>
                          {user.name
                            ? user.name.charAt(0).toUpperCase()
                            : user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className='absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center'>
                        <Edit2 className='w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                      </div>
                    </div>
                  </div>
                  <h2 className='mt-4 text-lg sm:text-xl font-semibold text-card-foreground'>
                    {user.name || '未设置姓名'}
                  </h2>
                  <p className='text-muted-foreground text-sm sm:text-base mb-4'>
                    {user.email}
                  </p>
                  <div className='flex items-center text-xs sm:text-sm text-muted-foreground'>
                    <Calendar className='w-3 h-3 sm:w-4 sm:h-4 mr-2' />
                    加入时间：{new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 详细信息编辑 */}
          <div className='lg:col-span-2'>
            <Card className='border-border bg-card'>
              <CardHeader className='pb-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-card-foreground'>个人信息</CardTitle>
                    <CardDescription className='text-muted-foreground'>更新您的个人信息和简介</CardDescription>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleEditToggle}
                    disabled={isLoading}
                  >
                    {isEditing ? (
                      <>
                        <X className='w-4 h-4 mr-2' />
                        取消
                      </>
                    ) : (
                      <>
                        <Edit2 className='w-4 h-4 mr-2' />
                        编辑
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label htmlFor='name' className='text-sm font-medium text-foreground'>姓名</Label>
                      {isEditing ? (
                        <Input
                          id='name'
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange('name', e.target.value)
                          }
                          placeholder='请输入姓名'
                          disabled={isLoading}
                          className='bg-background border-input'
                        />
                      ) : (
                        <div className='flex items-center p-3 bg-muted rounded-md'>
                          <User className='w-4 h-4 mr-2 text-muted-foreground' />
                          <span className='text-foreground'>{user.name || '未设置'}</span>
                        </div>
                      )}
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='email' className='text-sm font-medium text-foreground'>邮箱地址</Label>
                      <div className='flex items-center p-3 bg-muted rounded-md'>
                        <Mail className='w-4 h-4 mr-2 text-muted-foreground' />
                        <span className='text-foreground'>{user.email}</span>
                      </div>
                      <p className='text-xs text-muted-foreground'>邮箱地址无法修改</p>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-2'>
                    <Label htmlFor='bio' className='text-sm font-medium text-foreground'>个人简介</Label>
                    {isEditing ? (
                      <Textarea
                        id='bio'
                        value={formData.bio}
                        onChange={(e) =>
                          handleInputChange('bio', e.target.value)
                        }
                        placeholder='介绍一下自己...'
                        rows={4}
                        disabled={isLoading}
                        className='bg-background border-input resize-none'
                      />
                    ) : (
                      <div className='p-3 bg-muted rounded-md min-h-[100px]'>
                        <span className='text-foreground'>{formData.bio || '暂无个人简介'}</span>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className='flex justify-end pt-4'>
                      <Button type='submit' disabled={isLoading} className='px-6'>
                        {isLoading ? (
                          '保存中...'
                        ) : (
                          <>
                            <Save className='w-4 h-4 mr-2' />
                            保存更改
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 头像上传对话框 */}
        <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-center'>更换头像</DialogTitle>
              <DialogDescription className='text-center text-muted-foreground'>
                选择一张新的头像图片
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-6 py-4'>
              <div className='flex justify-center'>
                <Avatar className='w-24 h-24 sm:w-32 sm:h-32 ring-2 ring-border'>
                  <AvatarImage
                    src={user?.avatar_url}
                    alt={getUserDisplayName(user)}
                  />
                  <AvatarFallback className='text-2xl sm:text-4xl bg-primary text-primary-foreground'>
                    {getUserDisplayName(user).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className='flex justify-center space-x-3'>
                <Button 
                  variant='outline' 
                  onClick={() => setIsAvatarDialogOpen(false)}
                  className='px-6'
                >
                  取消
                </Button>
                <Button className='px-6'>上传新头像</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
