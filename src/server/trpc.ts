import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

// 创建tRPC实例
const t = initTRPC.create({
  transformer: superjson,
})

// 导出可重用的路由器和过程构建器
export const router = t.router
export const publicProcedure = t.procedure