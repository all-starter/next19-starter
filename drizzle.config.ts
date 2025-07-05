import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// 根据当前环境加载对应的环境变量配置文件
if (process.env.NODE_ENV === 'production') {
  // 生产环境加载 .env.production
  config({
    path: '.env.production',
  })
} else {
  // 开发环境加载 .env.development
  config({
    path: '.env.development',
  })
}

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  throw new Error('❌ DATABASE_URL 环境变量未定义')
}

// 连接配置
const getDbCredentials = () => {
  const url = DATABASE_URL
  if (process.env.NODE_ENV === 'production') {
    // 生产环境需要 SSL
    return {
      url,
      ssl: true,
      // 连接池配置
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
