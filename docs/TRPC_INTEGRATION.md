# tRPC 集成说明

本项目已成功集成 tRPC 最新版本，提供类型安全的 API 调用体验。

## 🚀 功能特性

- ✅ tRPC v11 最新版本
- ✅ 完整的 TypeScript 类型安全
- ✅ React Query 集成
- ✅ 服务端和客户端配置
- ✅ 示例 API 端点
- ✅ 实时演示界面

## 📁 项目结构

```
src/
├── app/
│   ├── api/trpc/[trpc]/
│   │   └── route.ts          # tRPC API 路由处理器
│   ├── layout.tsx            # 根布局（包含 TRPCProvider）
│   └── page.tsx              # 主页面（包含演示组件）
├── components/
│   ├── providers/
│   │   └── trpc-provider.tsx # tRPC 和 React Query 提供者
│   └── trpc-demo.tsx         # tRPC 功能演示组件
├── server/
│   ├── trpc.ts               # tRPC 实例配置
│   └── routers/
│       └── _app.ts           # API 路由定义
└── utils/
    └── trpc.ts               # tRPC 客户端配置
```

## 🛠️ 安装的依赖

```json
{
  "@trpc/server": "^11.4.3",
  "@trpc/client": "^11.4.3",
  "@trpc/react-query": "^11.4.3",
  "@trpc/next": "^11.4.3",
  "@tanstack/react-query": "^5.81.5",
  "zod": "^3.25.71",
  "superjson": "^2.2.2"
}
```

## 📝 API 端点示例

### 1. 问候 API

```typescript
hello: publicProcedure
  .input(z.object({ nickname: z.string().optional() }))
  .query(({ input }) => {
    return {
      greeting: `Hello ${input.nickname ?? 'World'}!`,
      timestamp: new Date().toISOString(),
    }
  })
```

### 2. 获取用户列表

```typescript
getUsers: publicProcedure.query(() => {
  return [
    { id: 1, nickname: 'Alice', email: 'alice@example.com' },
    // ...
  ]
})
```

### 3. 创建用户

```typescript
createUser: publicProcedure
  .input(
    z.object({
      nickname: z.string().min(1),
      email: z.string().email(),
    })
  )
  .mutation(({ input }) => {
    // 创建用户逻辑
  })
```

### 4. 随机数生成器

```typescript
getRandomNumber: publicProcedure
  .input(
    z.object({
      min: z.number().default(1),
      max: z.number().default(100),
    })
  )
  .query(({ input }) => {
    // 生成随机数逻辑
  })
```

## 🎯 使用方法

### 在组件中使用 tRPC

```typescript
import { trpc } from '@/utils/trpc';

function MyComponent() {
  // 查询数据
  const { data, isLoading, error } = trpc.hello.useQuery({ nickname: 'World' });

  // 变更数据
  const createUser = trpc.createUser.useMutation({
    onSuccess: () => {
      console.log('用户创建成功!');
    },
  });

  const handleCreateUser = () => {
    createUser.mutate({ nickname: 'John', email: 'john@example.com' });
  };

  return (
    <div>
      {isLoading && <p>加载中...</p>}
      {error && <p>错误: {error.message}</p>}
      {data && <p>{data.greeting}</p>}

      <button onClick={handleCreateUser}>
        创建用户
      </button>
    </div>
  );
}
```

### 添加新的 API 端点

1. 在 `src/server/routers/_app.ts` 中添加新的过程：

```typescript
export const appRouter = router({
  // 现有的端点...

  // 新的端点
  myNewEndpoint: publicProcedure
    .input(
      z.object({
        /* 输入验证 */
      })
    )
    .query(({ input }) => {
      // 处理逻辑
      return {
        /* 返回数据 */
      }
    }),
})
```

2. TypeScript 会自动推断类型，无需额外配置。

## 🔧 配置说明

### 服务端配置

- `src/server/trpc.ts`: tRPC 实例配置，包含 superjson 转换器
- `src/app/api/trpc/[trpc]/route.ts`: Next.js App Router API 处理器

### 客户端配置

- `src/utils/trpc.ts`: tRPC React 客户端
- `src/components/providers/trpc-provider.tsx`: Provider 组件，包装 React Query

### 环境适配

- 自动检测运行环境（开发/生产/Vercel）
- 支持 SSR 和客户端渲染
- 批量请求优化

## 🚀 启动项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 `http://localhost:3000` 查看 tRPC 集成演示。

## 📚 相关文档

- [tRPC 官方文档](https://trpc.io/docs)
- [React Query 文档](https://tanstack.com/query/latest)
- [Zod 验证库](https://zod.dev/)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🎉 下一步

1. 根据需求添加更多 API 端点
2. 集成数据库（如 Prisma）
3. 添加身份验证和授权
4. 实现文件上传功能
5. 添加实时功能（WebSocket）
