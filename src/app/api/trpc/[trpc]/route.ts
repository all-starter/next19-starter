import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/routers/_app'

/**
 * tRPC API路由处理器
 * 处理所有发送到/api/trpc的HTTP请求，支持GET和POST方法
 * 配置了错误处理和上下文创建
 * @param req - HTTP请求对象
 * @returns HTTP响应
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
    onError: ({ error }) => {
      console.error('tRPC error:', error)
    },
  })

/**
 * 导出GET和POST方法处理器
 * Next.js App Router要求为每个HTTP方法导出对应的处理函数
 */
export { handler as GET, handler as POST }
