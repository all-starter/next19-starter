import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/routers/_app'
import { QueryClientConfig } from '@tanstack/react-query'

/**
 * tRPC React客户端实例
 * 提供类型安全的API调用hooks，基于服务端AppRouter类型
 * 用于在React组件中调用tRPC API
 */
export const trpc = createTRPCReact<AppRouter>()

/**
 * React Query客户端配置
 * 设置查询的默认行为，包括缓存策略和重新获取策略
 * @property defaultOptions.queries.refetchOnWindowFocus - 窗口聚焦时不重新获取数据
 * @property defaultOptions.queries.staleTime - 数据过期时间为60秒
 */
export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
}
