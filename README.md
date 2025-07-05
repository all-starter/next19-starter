# Next.js 15 现代化技术栈演示项目

这是一个基于 [Next.js](https://nextjs.org) 的现代化全栈项目，展示了最新的 React 19 + Next.js 15 技术栈的完整集成。

## 🚀 技术栈

### 核心框架

- **Next.js 15** - 使用 App Router 和 Turbopack
- **React 19** - 最新版本的 React
- **TypeScript** - 类型安全的开发体验

### UI 和样式

- **Tailwind CSS v4** - 现代化的 CSS 框架
- **Shadcn/UI** - 高质量的 React 组件库
- **Radix UI** - 无障碍的原始组件
- **Lucide React** - 美观的图标库
- **next-themes** - 深色/浅色主题切换

### 状态管理和数据获取

- **tRPC** - 端到端类型安全的 API
- **TanStack Query (React Query)** - 强大的数据获取和缓存
- **Zustand** - 轻量级状态管理
- **nuqs** - URL 状态管理

### 数据库和 ORM

- **Drizzle ORM** - 类型安全的 SQL ORM
- **PostgreSQL** - 生产级关系型数据库
- **Drizzle Kit** - 数据库迁移和管理工具

### 开发工具

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **pnpm** - 快速的包管理器
- **tsx** - TypeScript 执行器

## 🛠️ 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- pnpm (推荐) 或 npm/yarn
- PostgreSQL 数据库

### 安装依赖

```bash
pnpm install
```

### 环境配置

1. 复制环境变量文件：

```bash
cp .env.example .env.development
```

2. 配置数据库连接和其他环境变量

### 数据库设置

```bash
# 生成数据库迁移文件
pnpm db:generate

# 执行数据库迁移
pnpm db:migrate

# 填充示例数据
pnpm db:seed
```

### 启动开发服务器

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

你可以通过修改 `src/app/page.tsx` 来编辑页面，文件保存后页面会自动更新。

## 📁 项目结构

```
src/
├── app/                 # Next.js App Router 页面
├── components/          # React 组件
│   ├── ui/             # Shadcn/UI 组件
│   └── providers/      # Context 提供者
├── server/             # tRPC 服务器端代码
├── db/                 # 数据库相关文件
├── hooks/              # 自定义 React Hooks
├── lib/                # 工具库和配置
├── store/              # Zustand 状态管理
├── types/              # TypeScript 类型定义
└── utils/              # 工具函数
```

## 🎯 主要功能演示

- **tRPC 集成** - 类型安全的 API 调用演示
- **Zustand 状态管理** - 客户端状态管理演示
- **主题切换** - 深色/浅色模式切换
- **响应式设计** - 移动端适配
- **数据库操作** - CRUD 操作演示

## 📜 可用脚本

### 开发相关

```bash
pnpm dev          # 启动开发服务器 (使用 Turbopack)
pnpm build        # 构建生产版本
pnpm start        # 启动生产服务器
pnpm lint         # 代码检查
pnpm format       # 代码格式化
```

### 数据库相关

```bash
pnpm db:generate  # 生成数据库迁移
pnpm db:migrate   # 执行数据库迁移
pnpm db:push      # 推送 schema 到数据库
pnpm db:studio    # 打开 Drizzle Studio
pnpm db:seed      # 填充示例数据
```

## 📚 学习资源

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 功能和 API
- [React 19 文档](https://react.dev/) - 学习 React 19 新特性
- [tRPC 文档](https://trpc.io/docs) - 端到端类型安全 API
- [Tailwind CSS 文档](https://tailwindcss.com/docs) - CSS 框架
- [Shadcn/UI 文档](https://ui.shadcn.com/) - 组件库
- [Drizzle ORM 文档](https://orm.drizzle.team/) - 数据库 ORM

## 🚀 部署

推荐使用 [Vercel 平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 部署，这是 Next.js 创建者提供的平台。

查看 [Next.js 部署文档](https://nextjs.org/docs/app/building-your-application/deploying) 了解更多详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

本项目采用 MIT 许可证。
