/**
 * 环境变量配置
 * 提供类型安全的环境变量访问
 */

// 服务端环境变量
const serverEnv = {
  NODE_ENV:
    (process.env.NODE_ENV as 'development' | 'production' | 'test') ||
    'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  VERCEL_URL: process.env.VERCEL_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
}

// 客户端安全环境变量（不包含敏感信息）
const clientEnv = {
  NODE_ENV:
    (process.env.NODE_ENV as 'development' | 'production' | 'test') ||
    'development',
  DATABASE_URL: '',
  VERCEL_URL: undefined,
  NEXTAUTH_SECRET: undefined,
  NEXTAUTH_URL: undefined,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
}

/**
 * 环境变量对象
 * 客户端只能访问安全的环境变量
 */
export const env = typeof window === 'undefined' ? serverEnv : clientEnv

/**
 * 导出服务端和客户端环境变量
 */
export { serverEnv, clientEnv }

/**
 * 环境检查工具函数
 */
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

/**
 * 获取应用基础 URL
 * 客户端安全版本
 */
export function getBaseUrl() {
  // 客户端环境
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // 服务端环境
  if (isProduction) {
    const vercelUrl =
      typeof window === 'undefined' ? serverEnv.VERCEL_URL : undefined
    if (vercelUrl) {
      return `https://${vercelUrl}`
    }
    // TODO: 生产环境默认域名（需要根据实际部署配置）
    return `https://your-domain.com`
  }

  // 开发环境
  return `http://localhost:3000`
}

/**
 * 数据库配置
 * 只在服务端使用
 */
export const dbConfig = {
  url: typeof window === 'undefined' ? serverEnv.DATABASE_URL : '',
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
