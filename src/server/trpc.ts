import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

/**
 * tRPC服务端实例
 * 配置了superjson转换器，支持Date、Map、Set等复杂类型的序列化
 * 这是所有tRPC路由和过程的基础配置
 */
const t = initTRPC.create({
  transformer: superjson,
})

/**
 * tRPC路由器构建器
 * 用于创建和组合API路由，支持嵌套路由结构
 */
export const router = t.router

/**
 * 公共过程构建器
 * 用于创建不需要身份验证的API端点
 * 可以链式调用input()、query()、mutation()等方法
 */
export const publicProcedure = t.procedure
