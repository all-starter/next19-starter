import { z } from 'zod'
import { desc } from 'drizzle-orm'
import { router, publicProcedure } from '../trpc'
import { db } from '../../db'
import { profiles, insertProfileSchema } from '../../db/schema'

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
    .input(z.object({ nickname: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.nickname ?? 'World'}!`,
        timestamp: new Date().toISOString(),
      }
    }),

  /**
   * 获取用户档案列表API
   * 从数据库查询所有用户档案数据，按创建时间倒序排列
   * @returns 用户档案对象数组，包含完整的用户档案信息
   */
  getProfiles: publicProcedure.query(async () => {
    try {
      const allProfiles = await db
        .select()
        .from(profiles)
        .orderBy(desc(profiles.createdAt))
      return allProfiles
    } catch (error) {
      console.error('获取用户档案列表失败:', error)
      throw new Error('获取用户档案列表失败')
    }
  }),

  /**
   * 创建用户档案API
   * 接收用户档案信息，验证后保存到数据库并返回创建的用户档案
   * @param input.id - Supabase Auth 用户 ID (UUID)
   * @param input.nickname - 可选的用户昵称，最大100字符
   * @param input.bio - 可选的用户简介，最大1000字符
   * @param input.avatar_url - 可选的用户头像链接
   * @returns 新创建的用户档案对象，包含时间戳
   */
  createProfile: publicProcedure
    .input(insertProfileSchema)
    .mutation(async ({ input }) => {
      try {
        const [newProfile] = await db
          .insert(profiles)
          .values({
            id: input.id,
            nickname: input.nickname,
            bio: input.bio,
            avatar_url: input.avatar_url,
          })
          .returning()

        return newProfile
      } catch (error) {
        console.error('创建用户档案失败:', error)
        // 检查是否是 ID 重复错误
        if (error instanceof Error && error.message.includes('unique')) {
          throw new Error('该用户档案已存在')
        }
        throw new Error('创建用户档案失败')
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
