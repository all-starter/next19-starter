import { z } from 'zod'
import { desc } from 'drizzle-orm'
import { router, publicProcedure } from '../trpc'
import { db } from '../../db'
import { profiles, insertUserSchema } from '../../db/schema'

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
   * 从数据库查询所有用户数据，按创建时间倒序排列
   * @returns 用户对象数组，包含完整的用户信息
   */
  getUsers: publicProcedure.query(async () => {
    try {
      const allUsers = await db
        .select()
        .from(profiles)
        .orderBy(desc(profiles.createdAt))
      return allUsers
    } catch (error) {
      console.error('获取用户列表失败:', error)
      throw new Error('获取用户列表失败')
    }
  }),

  /**
   * 创建用户API
   * 接收用户信息，验证后保存到数据库并返回创建的用户
   * @param input.name - 用户名，至少1个字符，最大100字符
   * @param input.email - 有效的邮箱地址，最大255字符
   * @param input.bio - 可选的用户简介，最大1000字符
   * @returns 新创建的用户对象，包含数据库生成的ID和时间戳
   */
  createUser: publicProcedure
    .input(insertUserSchema)
    .mutation(async ({ input }) => {
      try {
        const [newUser] = await db
          .insert(profiles)
          .values({
            name: input.name,
            email: input.email,
            bio: input.bio,
          })
          .returning()

        return newUser
      } catch (error) {
        console.error('创建用户失败:', error)
        // 检查是否是邮箱重复错误
        if (error instanceof Error && error.message.includes('unique')) {
          throw new Error('该邮箱地址已被使用')
        }
        throw new Error('创建用户失败')
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
