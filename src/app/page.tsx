import Image from 'next/image'
import { TRPCDemo } from '@/components/trpc-demo'

export default function Home() {
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
          <h1 className='text-2xl font-bold mb-4'>Next.js 19 + tRPC 集成演示</h1>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl'>
            这个项目展示了如何在 Next.js 19 中集成 tRPC 最新版本，包括类型安全的 API 调用、
            React Query 集成以及服务端和客户端的完整配置。
          </p>
        </div>
      </header>

      <main>
        <TRPCDemo />
      </main>

      <footer className='mt-16 flex gap-[24px] flex-wrap items-center justify-center'>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://trpc.io/docs'
          target='_blank'
          rel='noopener noreferrer'>
          <Image
            aria-hidden
            src='/file.svg'
            alt='File icon'
            width={16}
            height={16}
          />
          tRPC 文档
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://nextjs.org/docs'
          target='_blank'
          rel='noopener noreferrer'>
          <Image
            aria-hidden
            src='/window.svg'
            alt='Window icon'
            width={16}
            height={16}
          />
          Next.js 文档
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://tanstack.com/query/latest'
          target='_blank'
          rel='noopener noreferrer'>
          <Image
            aria-hidden
            src='/globe.svg'
            alt='Globe icon'
            width={16}
            height={16}
          />
          React Query 文档
        </a>
      </footer>
    </div>
  )
}
