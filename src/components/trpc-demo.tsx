'use client'

import { useTRPCDemo } from '@/hooks/use-trpc-demo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { CSS_CLASSES, UI_MESSAGES } from '@/constants/app'
import { formatTimestamp, isArray } from '@/utils/helpers'
import type { User } from '@/db/schema'
import { Separator } from './ui/separator'

/**
 * tRPC功能演示组件
 * 使用TypeScript严格类型，组件分离，错误处理
 */
export function TRPCDemo() {
  const {
    formState,
    updateField,
    isFormValid,
    helloQuery,
    usersQuery,
    randomNumberQuery,
    createUserMutation,
    handleCreateUser,
    refreshRandomNumber,
  } = useTRPCDemo()

  return (
    <div className={CSS_CLASSES.CONTAINER}>
      <h1 className='text-3xl font-bold text-center mb-8'>tRPC 集成演示</h1>

      {/* Hello API 演示 */}
      <Card>
        <CardHeader>
          <CardTitle>问候 API</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <input
            type='text'
            placeholder='输入你的名字'
            value={formState.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={CSS_CLASSES.INPUT}
          />
          <div className={CSS_CLASSES.INFO_BOX}>
            {helloQuery.isLoading ? (
              <div className='flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span>{UI_MESSAGES.LOADING}</span>
              </div>
            ) : helloQuery.error ? (
              <Alert variant='destructive'>
                <AlertDescription>
                  {helloQuery.error.message || '发生错误'}
                </AlertDescription>
              </Alert>
            ) : (
              <div>
                <p className='font-medium'>{helloQuery.data?.greeting}</p>
                <p className='text-sm text-gray-500'>
                  时间:{' '}
                  {helloQuery.data?.timestamp
                    ? formatTimestamp(helloQuery.data.timestamp)
                    : ''}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 用户列表演示 */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          {usersQuery.isLoading ? (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>{UI_MESSAGES.LOADING}</span>
            </div>
          ) : usersQuery.error ? (
            <Alert variant='destructive'>
              <AlertDescription>
                {usersQuery.error.message || '发生错误'}
              </AlertDescription>
            </Alert>
          ) : (
            <div className='space-y-2'>
              {isArray(usersQuery.data) ? (
                (usersQuery.data as User[]).map((user) => (
                  <div
                    key={user.id}
                    className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'
                  >
                    <p className='font-medium'>{user.name}</p>
                    <p className='text-sm text-gray-500'>{user.email}</p>
                    <Separator className='my-2' />
                    <p className='text-sm text-gray-500'>{user.bio}</p>
                  </div>
                ))
              ) : (
                <Alert variant='destructive'>
                  <AlertDescription>
                    {UI_MESSAGES.DATA_FORMAT_ERROR} {typeof usersQuery.data}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 创建用户演示 */}
      <Card>
        <CardHeader>
          <CardTitle>创建用户</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className='space-y-4'>
            <input
              type='text'
              placeholder='用户名'
              value={formState.userName}
              onChange={(e) => updateField('userName', e.target.value)}
              className={CSS_CLASSES.INPUT}
              required
            />
            <input
              type='email'
              placeholder='邮箱'
              value={formState.userEmail}
              onChange={(e) => updateField('userEmail', e.target.value)}
              className={CSS_CLASSES.INPUT}
              required
            />
            <Button
              type='submit'
              disabled={createUserMutation.isPending || !isFormValid()}
            >
              {createUserMutation.isPending ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  {UI_MESSAGES.CREATING}
                </>
              ) : (
                '创建用户'
              )}
            </Button>
            {createUserMutation.error && (
              <Alert variant='destructive'>
                <AlertDescription>
                  {createUserMutation.error.message || '创建用户失败'}
                </AlertDescription>
              </Alert>
            )}
            {createUserMutation.data && (
              <div className={CSS_CLASSES.SUCCESS_BOX}>
                <p className='text-green-700 dark:text-green-300'>
                  {UI_MESSAGES.USER_CREATED_SUCCESS}
                </p>
                <p className='text-sm'>ID: {createUserMutation.data.id}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* 随机数演示 */}
      <Card>
        <CardHeader>
          <CardTitle>随机数生成器</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex gap-2'>
            <Button onClick={refreshRandomNumber}>生成新的随机数</Button>
            <Button
              variant='outline'
              onClick={() => toast.success('这是一个成功通知！')}
            >
              成功通知
            </Button>
            <Button
              variant='destructive'
              onClick={() => toast.error('这是一个错误通知！')}
            >
              错误通知
            </Button>
          </div>
          <div className={CSS_CLASSES.INFO_BOX}>
            {randomNumberQuery.isLoading ? (
              <div className='flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span>{UI_MESSAGES.GENERATING}</span>
              </div>
            ) : randomNumberQuery.error ? (
              <Alert variant='destructive'>
                <AlertDescription>
                  {randomNumberQuery.error.message || '生成随机数失败'}
                </AlertDescription>
              </Alert>
            ) : (
              <div>
                <p className='text-2xl font-bold'>
                  {randomNumberQuery.data?.number}
                </p>
                <p className='text-sm text-gray-500'>
                  范围: {randomNumberQuery.data?.range}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
