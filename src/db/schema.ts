import {
  pgTable,
  uuid,
  timestamp,
  text,
  index,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod/v4'

/**
 * 用户档案表定义
 * 与 Supabase Auth 用户关联，存储用户的扩展信息
 */
export const profiles = pgTable(
  'profiles',
  {
    /**
     * 用户唯一标识符
     * 对应 Supabase Auth 用户 ID (UUID)
     */
    id: uuid('id').primaryKey().notNull(),

    /**
     * 邮箱
     * 对应 Supabase Auth 用户邮箱
     */
    email: text('email').unique(),

    /**
     * 用户昵称
     * 可选字段
     */
    nickname: text('nickname'),

    /**
     * 用户简介或描述
     * 可选字段，文本类型
     */
    bio: text('bio'),

    /**
     * 用户头像 URL
     * 可选字段
     */
    avatar_url: text('avatar_url'),

    /**
     * 记录创建时间
     * 自动设置为当前时间戳
     */
    createdAt: timestamp('created_at').defaultNow().notNull(),

    /**
     * 记录更新时间
     * 自动更新为当前时间戳
     */
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [index('nickname_idx').on(t.nickname)]
)

export const config = pgTable('config', {
  key: text('key').primaryKey(),
  value: text('value'),
})

/**
 * 用户插入数据验证模式
 * 基于数据库表结构自动生成，用于创建用户时的数据验证
 * 排除自动生成的字段（id, createdAt, updatedAt）
 */
export const insertProfileSchema = createInsertSchema(profiles, {
  nickname: (schema) =>
    schema.max(100, '昵称长度不能超过100字符').trim().optional(),
  bio: (schema) => schema.max(1000, '简介长度不能超过1000字符').optional(),
  avatar_url: (schema) => schema.url('请输入有效的头像链接').optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
})

/**
 * 用户档案查询数据验证模式
 * 基于数据库表结构自动生成，用于查询结果的类型验证
 */
export const selectProfileSchema = createSelectSchema(profiles)

/**
 * 用户档案更新数据验证模式
 * 用于部分更新用户档案信息，所有字段都是可选的
 */
export const updateProfileSchema = insertProfileSchema
  .partial()
  .omit({ id: true })

/**
 * 用户档案数据类型定义
 */
export type Profile = z.infer<typeof selectProfileSchema>
export type NewProfile = z.infer<typeof insertProfileSchema>
export type UpdateProfile = z.infer<typeof updateProfileSchema>

/**
 * 向后兼容的用户类型别名
 * @deprecated 请使用 Profile 类型
 */
export type User = Profile
export type NewUser = NewProfile
export type UpdateUser = UpdateProfile

/**
 * 导出所有表的联合类型
 * 便于在其他地方引用完整的数据库模式
 */
export const schema = {
  profiles,
}
