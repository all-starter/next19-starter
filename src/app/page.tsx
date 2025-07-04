'use client'

import Image from 'next/image'
import { TRPCDemo } from '@/components/trpc-demo'
import { ZustandDemo } from '@/components/zustand-demo'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { File } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'trpc' | 'zustand'>('trpc')

  return (
    <div className='min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] dark:bg-black'>
      <header className='flex flex-col items-center gap-8 mb-12'>
        <Image
          className='dark:invert'
          src='/next.svg'
          alt='Next.js logo'
          width={180}
          height={38}
          priority
        />
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Next.js 19 现代化技术栈演示</h1>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl'>
            这个项目展示了 Next.js 19 + React 19 + TypeScript + Tailwind CSS v4 + Shadcn/UI + tRPC + Zustand 的完整集成，
            包括类型安全的 API 调用、状态管理、UI 组件库和现代化开发体验。
          </p>
        </div>
        
        {/* 标签页导航 */}
        <div className='flex gap-2 p-1 bg-muted rounded-lg'>
          <Button
            onClick={() => setActiveTab('trpc')}
            variant={activeTab === 'trpc' ? 'default' : 'ghost'}
            size='sm'
          >
            tRPC 演示
          </Button>
          <Button
            onClick={() => setActiveTab('zustand')}
            variant={activeTab === 'zustand' ? 'default' : 'ghost'}
            size='sm'
          >
            Zustand 演示
          </Button>
        </div>
      </header>

      <main>
        {activeTab === 'trpc' && <TRPCDemo />}
        {activeTab === 'zustand' && <ZustandDemo />}
      </main>

      <footer className='mt-16 flex gap-[24px] flex-wrap items-center justify-center'>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://trpc.io/docs'
          target='_blank'
          rel='noopener noreferrer'>
          <File className='w-4 h-4' />
          tRPC 文档
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://nextjs.org/docs'
          target='_blank'
          rel='noopener noreferrer'>
          <File className='w-4 h-4' />
          Next.js 文档
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://tanstack.com/query/latest'
          target='_blank'
          rel='noopener noreferrer'>
          <File className='w-4 h-4' />
          React Query 文档
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://zustand-demo.pmnd.rs/'
          target='_blank'
          rel='noopener noreferrer'>
          <File className='w-4 h-4' />
          Zustand 文档
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://ui.shadcn.com/'
          target='_blank'
          rel='noopener noreferrer'>
          <File className='w-4 h-4' />
          Shadcn/UI 文档
        </a>
      </footer>
    </div>
  )
}
