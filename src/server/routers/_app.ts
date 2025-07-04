import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

/**
 * tRPC应用路由器
 * 定义所有可用的API端点，包括查询和变更操作
 * 所有端点都使用Zod进行输入验证，确保类型安全
 */
export const appRouter = router({
  /**
   * 问候API
   * 接收可选的用户名参数，返回个性化问候消息和时间戳
   * @param input.name - 可选的用户名
   * @returns 包含问候消息和时间戳的对象
   */
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? 'World'}!`,
        timestamp: new Date().toISOString(),
      }
    }),

  /**
   * 获取用户列表API
   * 返回预定义的用户列表，用于演示目的
   * 在实际应用中，这里会从数据库查询用户数据
   * @returns 用户对象数组，包含id、name和email字段
   */
  getUsers: publicProcedure.query(() => {
    return [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    ]
  }),

  /**
   * 创建用户API
   * 接收用户名和邮箱，创建新用户并返回用户信息
   * 在实际应用中，这里会将用户数据保存到数据库
   * @param input.name - 用户名，至少1个字符
   * @param input.email - 有效的邮箱地址
   * @returns 新创建的用户对象，包含随机生成的ID和创建时间
   */
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      })
    )
    .mutation(({ input }) => {
      // 在实际应用中，这里会保存到数据库
      return {
        id: Math.floor(Math.random() * 1000),
        name: input.name,
        email: input.email,
        createdAt: new Date().toISOString(),
      }
    }),

  /**
   * 获取随机数API
   * 在指定范围内生成随机整数
   * @param input.min - 最小值，默认为1
   * @param input.max - 最大值，默认为100
   * @returns 包含随机数和范围信息的对象
   */
  getRandomNumber: publicProcedure
    .input(
      z.object({
        min: z.number().default(1),
        max: z.number().default(100),
      })
    )
    .query(({ input }) => {
      const randomNumber =
        Math.floor(Math.random() * (input.max - input.min + 1)) + input.min
      return {
        number: randomNumber,
        range: `${input.min}-${input.max}`,
      }
    }),
})

/**
 * 应用路由器类型定义
 * 用于tRPC客户端的类型推断，确保客户端调用的类型安全
 * 这个类型会被客户端用来生成类型安全的API调用方法
 */
export type AppRouter = typeof appRouter
