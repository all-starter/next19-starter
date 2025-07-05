/**
 * 环境变量配置和验证
 * 提供类型安全的环境变量访问
 */

import { config } from 'dotenv'
import { z } from 'zod'

// 加载环境变量文件

config({ path: '.env.development' })

/**
 * 环境变量验证模式
 */
const envSchema = z.object({
  // 基础环境配置
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).default('3000'),

  // 数据库配置
  DATABASE_URL: z.string().min(1, 'DATABASE_URL 是必需的'),

  // 部署配置 (可选)
  VERCEL_URL: z.string().optional(),

  // 认证配置 (可选)
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
})

/**
 * 验证并解析环境变量
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ 环境变量验证失败:')
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
    }
    process.exit(1)
  }
}

/**
 * 类型安全的环境变量
 */
export const env = validateEnv()

/**
 * 环境检查工具函数
 */
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

/**
 * 获取应用基础 URL
 */
export function getBaseUrl() {
  // 生产环境
  if (isProduction) {
    if (env.VERCEL_URL) {
      return `https://${env.VERCEL_URL}`
    }
    // 其他生产环境部署平台
    return `https://localhost:${env.PORT}`
  }

  // 开发环境
  return `http://localhost:${env.PORT}`
}

/**
 * 数据库配置
 */
export const dbConfig = {
  url: env.DATABASE_URL,
  // 生产环境启用连接池
  pool: isProduction
    ? {
        min: 2,
        max: 10,
        idleTimeoutMillis: 30000,
      }
    : undefined,
}

/**
 * 日志配置
 */
export const logConfig = {
  level: isDevelopment ? 'debug' : 'info',
  pretty: isDevelopment,
}
