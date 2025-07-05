import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env, dbConfig, isDevelopment } from '@/lib/env'
import * as schema from './schema'

/**
 * PostgreSQL 连接实例
 * 根据环境自动配置连接参数
 */
const client = postgres(dbConfig.url, {
  // 生产环境配置
  ...dbConfig.pool,
  // 开发环境启用详细日志
  debug: isDevelopment,
  // 连接超时配置
  connect_timeout: 10,
  idle_timeout: 20,
  max_lifetime: 60 * 30, // 30 分钟
})

/**
 * Drizzle 数据库实例
 * 导出供应用程序使用
 */
export const db = drizzle(client, {
  schema,
  // 开发环境启用查询日志
  logger: isDevelopment,
})

/**
 * 数据库连接类型
 */
export type Database = typeof db

/**
 * 优雅关闭数据库连接
 */
export async function closeDatabase() {
  await client.end()
}

// 进程退出时自动关闭连接
if (typeof process !== 'undefined') {
  process.on('SIGINT', closeDatabase)
  process.on('SIGTERM', closeDatabase)
}
