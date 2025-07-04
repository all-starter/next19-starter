'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { useState } from 'react'
import superjson from 'superjson'
import { trpc, queryClientConfig } from '@/utils/trpc'

/**
 * 获取应用基础URL
 * 根据运行环境自动确定正确的基础URL
 * @returns 基础URL字符串
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // 浏览器环境
    return ''
  }
  if (process.env.VERCEL_URL) {
    // Vercel部署环境
    return `https://${process.env.VERCEL_URL}`
  }
  // 本地开发环境
  return `http://localhost:${process.env.PORT ?? 3000}`
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
          url: `${getBaseUrl()}/api/trpc`,
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
