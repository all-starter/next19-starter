import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const appRouter = router({
  // 简单的问候API
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? 'World'}!`,
        timestamp: new Date().toISOString(),
      }
    }),

  // 获取用户列表的示例API
  getUsers: publicProcedure
    .query(() => {
      return [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' },
      ]
    }),

  // 创建用户的示例API
  createUser: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
    }))
    .mutation(({ input }) => {
      // 在实际应用中，这里会保存到数据库
      return {
        id: Math.floor(Math.random() * 1000),
        name: input.name,
        email: input.email,
        createdAt: new Date().toISOString(),
      }
    }),

  // 获取随机数的示例API
  getRandomNumber: publicProcedure
    .input(z.object({
      min: z.number().default(1),
      max: z.number().default(100),
    }))
    .query(({ input }) => {
      const randomNumber = Math.floor(Math.random() * (input.max - input.min + 1)) + input.min
      return {
        number: randomNumber,
        range: `${input.min}-${input.max}`,
      }
    }),
})

// 导出路由器类型定义
export type AppRouter = typeof appRouter;