import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  index,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod/v4'

/**
 * 用户档案表定义
 * 包含用户的基本信息：ID、姓名、邮箱和时间戳
 */
export const profiles = pgTable(
  'profiles',
  {
    /**
     * 用户唯一标识符
     * 自增主键
     */
    id: serial('id').primaryKey(),

    /**
     * 用户姓名
     * 必填字段，最大长度100字符
     */
    name: varchar('name', { length: 100 }).notNull(),

    /**
     * 用户邮箱地址
     * 必填字段，唯一约束，最大长度255字符
     */
    email: varchar('email', { length: 255 }).notNull().unique(),

    /**
     * 用户简介或描述
     * 可选字段，文本类型
     */
    bio: text('bio'),

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
  (t) => [index('name_idx').on(t.name)]
)

export const config = pgTable('config', {
  key: varchar('key', { length: 255 }).primaryKey(),
  value: text('value'),
})

/**
 * 用户插入数据验证模式
 * 基于数据库表结构自动生成，用于创建用户时的数据验证
 * 排除自动生成的字段（id, createdAt, updatedAt）
 */
export const insertUserSchema = createInsertSchema(profiles, {
  name: (schema) =>
    schema.min(1, '姓名不能为空').max(100, '姓名长度不能超过100字符').trim(),
  email: () =>
    z.email('请输入有效的邮箱地址').max(255, '邮箱长度不能超过255字符').trim(),
  bio: (schema) => schema.max(1000, '简介长度不能超过1000字符').optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

/**
 * 用户查询数据验证模式
 * 基于数据库表结构自动生成，用于查询结果的类型验证
 */
export const selectUserSchema = createSelectSchema(profiles)

/**
 * 用户更新数据验证模式
 * 用于部分更新用户信息，所有字段都是可选的
 */
export const updateUserSchema = insertUserSchema.partial()

/**
 * 用户数据类型定义
 */
export type User = z.infer<typeof selectUserSchema>
export type NewUser = z.infer<typeof insertUserSchema>
export type UpdateUser = z.infer<typeof updateUserSchema>

/**
 * 导出所有表的联合类型
 * 便于在其他地方引用完整的数据库模式
 */
export const schema = {
  profiles,
}
