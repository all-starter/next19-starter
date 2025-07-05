# 环境配置指南

本项目支持多环境配置，包括开发环境和生产环境的分离管理，特别优化了 Vercel Postgres 的连接配置。

## 📁 环境文件结构

```
├── .env.example          # 环境变量模板文件（提交到版本控制）
├── .env.development     # 开发环境配置（不提交到版本控制）
├── .env.production      # 生产环境配置（不提交到版本控制）
└── src/lib/env.ts       # 环境变量验证和管理
```

## 🚀 快速开始

### 1. 设置开发环境

```bash
# 复制环境模板文件
cp .env.example .env.development

# 编辑开发环境配置
# 修改 .env.development 中的数据库连接等配置
```

### 2. 配置 Vercel Postgres

#### 方式一：使用 Vercel 自动注入的环境变量

在 Vercel 项目中，Postgres 数据库会自动注入以下环境变量：

```bash
# 在 .env.production 中使用 Vercel 自动注入的变量
DATABASE_URL="$POSTGRES_URL"
NODE_ENV="production"
```

#### 方式二：手动配置连接字符串

```bash
# 在 .env.production 中手动设置
DATABASE_URL="postgres://username:password@ep-xxx-xxx.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
NODE_ENV="production"
```

### 3. 验证环境配置

```bash
# 检查环境变量是否正确配置
pnpm run env:check
```

### 4. 启动开发服务器

```bash
# 开发环境
pnpm run dev

# 或者明确指定环境
pnpm run dev:prod  # 使用生产环境配置进行开发
```

## 🔧 环境变量说明

### 必需变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NODE_ENV` | 应用环境 | `development` / `production` |
| `DATABASE_URL` | 数据库连接字符串 | 见下方数据库配置部分 |

### 数据库配置

#### 开发环境 (本地 PostgreSQL)
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/your_database"
```

#### 生产环境 (Vercel Postgres)
```bash
# 使用 Vercel 自动注入的变量
DATABASE_URL="$POSTGRES_URL"

# 或手动配置
DATABASE_URL="postgres://username:password@ep-xxx-xxx.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require"
```

#### 生产环境 (Neon)
```bash
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### 可选变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `PORT` | 应用端口 | `3000` |
| `VERCEL_URL` | Vercel 部署域名 | `your-app.vercel.app` |
| `NEXTAUTH_SECRET` | NextAuth 密钥 | `your-secret-key` |
| `NEXTAUTH_URL` | NextAuth 回调 URL | `http://localhost:3000` |

## 📊 数据库操作

### 开发环境

```bash
# 生成迁移文件
pnpm run db:generate

# 推送 schema 到数据库
pnpm run db:push

# 运行数据填充
pnpm run db:seed

# 打开数据库管理界面
pnpm run db:studio
```

### 生产环境 (Vercel Postgres)

```bash
# 生产环境数据库操作（需要先配置 .env.production）
pnpm run db:generate:prod
pnpm run db:migrate:prod
pnpm run db:seed:prod
pnpm run db:studio:prod
```

## 🏗️ 构建和部署

### 开发构建

```bash
pnpm run build:dev
pnpm run start:dev
```

### 生产构建

```bash
pnpm run build
pnpm run start
```

### Vercel 部署

1. **连接 Vercel Postgres**
   - 在 Vercel Dashboard 中创建 Postgres 数据库
   - 数据库环境变量会自动注入到项目中

2. **配置环境变量**
   ```bash
   # 在 Vercel 项目设置中添加
   NODE_ENV=production
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

3. **部署前数据库迁移**
   ```bash
   # 本地运行生产环境迁移
   pnpm run db:migrate:prod
   ```

## 🔒 安全注意事项

1. **永远不要提交包含敏感信息的环境文件**
   - `.env.development`、`.env.production` 等文件已在 `.gitignore` 中排除

2. **使用强密码和密钥**
   - 数据库密码应使用强密码
   - `NEXTAUTH_SECRET` 应使用随机生成的强密钥

3. **生产环境配置**
   - 生产环境应使用独立的数据库
   - 启用 HTTPS
   - 配置适当的 CORS 策略
   - Vercel Postgres 自动启用 SSL

4. **Vercel Postgres 最佳实践**
   - 使用连接池避免连接数限制
   - 监控数据库使用量和性能
   - 定期备份重要数据

## 🐛 故障排除

### 环境变量未加载

```bash
# 检查环境变量配置
pnpm run env:check

# 确认文件路径和内容
cat .env.development
```

### 数据库连接失败

1. **本地开发环境**
   - 检查 PostgreSQL 服务是否运行
   - 验证 `DATABASE_URL` 格式是否正确
   - 确认数据库用户权限

2. **Vercel Postgres**
   - 确认数据库已在 Vercel Dashboard 中创建
   - 检查环境变量是否正确注入
   - 验证 SSL 连接配置
   - 检查连接数是否超出限制

### SSL 连接问题

```bash
# 确保 Vercel Postgres 连接字符串包含 SSL 参数
DATABASE_URL="postgres://...?sslmode=require"
```

### 类型错误

环境变量通过 `src/lib/env.ts` 进行类型验证，如果出现类型错误：

1. 检查环境变量是否符合 schema 定义
2. 更新 `envSchema` 以匹配新的需求

## 📚 相关文档

- [Vercel Postgres 文档](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
- [Drizzle ORM 配置文档](https://orm.drizzle.team/docs/get-started-postgresql)
- [Zod 验证文档](https://zod.dev/)
