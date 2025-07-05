import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'
import { env, isProduction } from './src/lib/env'

// 根据环境加载对应的环境变量文件
if (isProduction) {
  config({ path: '.env.production' })
} else {
  config({ path: '.env.development' })
}

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL 环境变量未定义')
}

// Vercel Postgres 连接配置
const getDbCredentials = () => {
  const url = env.DATABASE_URL

  // 检查是否为 Vercel Postgres 连接
  const isVercelPostgres =
    url.includes('vercel-storage.com') || url.includes('neon.tech')

  if (isVercelPostgres || isProduction) {
    // Vercel Postgres 或生产环境需要 SSL
    return {
      url,
      ssl: true,
      // Vercel Postgres 连接池配置
      connectionString:
        url + (url.includes('?') ? '&' : '?') + 'sslmode=require',
    }
  }

  // 开发环境本地数据库
  return { url }
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: getDbCredentials(),
})
