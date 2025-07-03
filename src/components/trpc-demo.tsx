'use client'

import { useTRPCDemo } from '@/hooks/use-trpc-demo'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { CSS_CLASSES, UI_MESSAGES } from '@/constants/app'
import { formatTimestamp, isArray } from '@/utils/helpers'
import type { User } from '@/types/api'

/**
 * tRPC功能演示组件
 * 根据.traerc.json规则：使用TypeScript严格类型，组件分离，错误处理
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
      <Card title='问候 API'>
        <div className='space-y-4'>
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
                <LoadingSpinner size='sm' />
                <span>{UI_MESSAGES.LOADING}</span>
              </div>
            ) : helloQuery.error ? (
              <ErrorMessage error={helloQuery.error} />
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
        </div>
      </Card>

      {/* 用户列表演示 */}
      <Card title='用户列表'>
        <div className='space-y-2'>
          {usersQuery.isLoading ? (
            <div className='flex items-center gap-2'>
              <LoadingSpinner size='sm' />
              <span>{UI_MESSAGES.LOADING}</span>
            </div>
          ) : usersQuery.error ? (
            <ErrorMessage error={usersQuery.error} />
          ) : (
            <div className='space-y-2'>
              {isArray(usersQuery.data) ? (
                (usersQuery.data as User[]).map((user) => (
                  <div
                    key={user.id}
                    className='p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>
                    <p className='font-medium'>{user.name}</p>
                    <p className='text-sm text-gray-500'>{user.email}</p>
                  </div>
                ))
              ) : (
                <ErrorMessage
                  error={`${
                    UI_MESSAGES.DATA_FORMAT_ERROR
                  } ${typeof usersQuery.data}`}
                  showPrefix={false}
                />
              )}
            </div>
          )}
        </div>
      </Card>

      {/* 创建用户演示 */}
      <Card title='创建用户'>
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
          <button
            type='submit'
            disabled={createUserMutation.isPending || !isFormValid()}
            className={`${CSS_CLASSES.BUTTON} ${
              !isFormValid() ? 'opacity-50 cursor-not-allowed' : ''
            }`}>
            {createUserMutation.isPending ? UI_MESSAGES.CREATING : '创建用户'}
          </button>
          {createUserMutation.error && (
            <ErrorMessage error={createUserMutation.error} />
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
      </Card>

      {/* 随机数演示 */}
      <Card title='随机数生成器'>
        <div className='space-y-4'>
          <button onClick={refreshRandomNumber} className={CSS_CLASSES.BUTTON}>
            生成新的随机数
          </button>
          <div className={CSS_CLASSES.INFO_BOX}>
            {randomNumberQuery.isLoading ? (
              <div className='flex items-center gap-2'>
                <LoadingSpinner size='sm' />
                <span>{UI_MESSAGES.GENERATING}</span>
              </div>
            ) : randomNumberQuery.error ? (
              <ErrorMessage error={randomNumberQuery.error} />
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
        </div>
      </Card>
    </div>
  )
}
