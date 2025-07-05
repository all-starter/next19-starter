'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'
import superjson from 'superjson'
import { trpc, queryClientConfig } from '@/utils/trpc'

/**
 * 获取客户端基础 URL
 * 客户端安全的 URL 获取函数，不依赖服务端环境变量
 */
function getClientBaseUrl() {
  // 浏览器环境
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // SSR 环境 - 使用 Next.js 的 VERCEL_URL 或默认值
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // 开发环境默认值
  return `http://localhost:3000`
}

/**
 * tRPC Provider组件
 * 为应用提供tRPC客户端和React Query客户端的上下文
 * 配置了HTTP批量链接和superjson转换器
 * @param children - 子组件
 * @returns JSX元素
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig))

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getClientBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
