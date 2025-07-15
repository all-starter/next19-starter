# Profiles 表与 Supabase Auth 集成指南

本文档说明了如何将项目中的 `users` 表重构为 `profiles` 表，并与 Supabase Auth 进行集成。

## 🎯 目标

- 将 `users` 表重命名为 `profiles` 表
- 使用 Supabase Auth 的用户 ID 作为 `profiles` 表的主键
- 在 `profiles` 表中存储用户的扩展信息（姓名、简介、头像等）
- 实现认证用户与档案信息的关联

## 📋 已完成的更改

### 1. 数据库 Schema 更改

**文件**: `src/db/schema.ts`

```typescript
// 原来的 users 表
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  nickname: varchar('nickname', { length: 255 }).notNull(),
  // ...
});

// 更改为 profiles 表
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // 使用 UUID，对应 Supabase Auth 用户 ID
  nickname: varchar('nickname', { length: 255 }), // 改为可选
  bio: text('bio'),
  avatar_url: varchar('avatar_url', { length: 500 }), // 新增头像字段
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
```

**主要变更**:
- `id` 字段从 `serial` 改为 `uuid`，用于存储 Supabase Auth 用户 ID
- 移除 `email` 字段（由 Supabase Auth 管理）
- `nickname` 字段改为可选
- 新增 `avatar_url` 字段
- 移除 `email` 的唯一约束

### 2. API 路由更新

**文件**: `src/server/routers/_app.ts`

```typescript
// 更新 API 端点
export const appRouter = router({
  getProfiles: publicProcedure.query(async () => {
    return await db.select().from(profiles);
  }),
  
  createProfile: publicProcedure
    .input(insertProfileSchema)
    .mutation(async ({ input }) => {
      const [profile] = await db.insert(profiles).values(input).returning();
      return profile;
    }),
});
```

### 3. 前端 Hooks 更新

**文件**: `src/hooks/use-trpc-demo.ts`
- `useUsersQuery` → `useProfilesQuery`
- `useCreateUserMutation` → `useCreateProfileMutation`
- 更新相关的类型定义

### 4. 新增专用 Hook

**文件**: `src/hooks/use-profile.ts`

这个 Hook 提供了完整的用户认证和档案管理功能：

```typescript
export function useProfile() {
  return {
    // 认证状态
    user,
    loading,
    isAuthenticated,
    
    // 档案数据
    currentProfile,
    profiles,
    
    // 操作方法
    upsertProfile,
    signIn,
    signUp,
    signOut,
  };
}
```

### 5. 演示组件

**文件**: `src/components/profile-demo.tsx`

完整的用户认证和档案管理演示组件，包括：
- 用户登录/注册
- 档案信息显示和编辑
- 所有用户档案列表

## 🔧 数据库迁移

### 手动迁移（推荐）

由于涉及表结构的重大更改，建议在 Supabase Dashboard 的 SQL 编辑器中手动执行迁移：

```sql
-- 1. 重命名表
ALTER TABLE users RENAME TO profiles;

-- 2. 修改 id 列类型为 UUID
ALTER TABLE profiles ALTER COLUMN id TYPE UUID USING gen_random_uuid();

-- 3. 删除 email 列
ALTER TABLE profiles DROP COLUMN email;

-- 4. 添加 avatar_url 列
ALTER TABLE profiles ADD COLUMN avatar_url VARCHAR(500);

-- 5. 修改 name 列为可选
ALTER TABLE profiles ALTER COLUMN name DROP NOT NULL;

-- 6. 重命名索引
ALTER INDEX name_idx RENAME TO profiles_nickname_idx;

-- 7. 清空现有数据（开发环境）
TRUNCATE TABLE profiles;
```

### 使用 Drizzle 推送

```bash
# 推送 schema 更改到数据库
pnpm db:push

# 运行种子数据
pnpm db:seed
```

## 🚀 使用方式

### 1. 基本用法

```typescript
import { useProfile } from '@/hooks/use-profile';

function MyComponent() {
  const { user, currentProfile, upsertProfile, signIn, signOut } = useProfile();
  
  // 检查用户是否已登录
  if (!user) {
    return <LoginForm onSignIn={signIn} />;
  }
  
  // 显示用户档案
  return (
    <div>
      <h1>欢迎, {currentProfile?.nickname || user.email}</h1>
      <button onClick={signOut}>退出登录</button>
    </div>
  );
}
```

### 2. 创建/更新档案

```typescript
const handleUpdateProfile = async () => {
  await upsertProfile({
    nickname: '张三',
    bio: '前端开发工程师',
    avatar_url: 'https://example.com/avatar.jpg',
  });
};
```

### 3. 获取特定用户档案

```typescript
import { useProfileById } from '@/hooks/use-profile';

function UserCard({ userId }: { userId: string }) {
  const { profile, loading } = useProfileById(userId);
  
  if (loading) return <div>加载中...</div>;
  
  return (
    <div>
      <h3>{profile?.name}</h3>
      <p>{profile?.bio}</p>
    </div>
  );
}
```

## 🔐 安全考虑

1. **Row Level Security (RLS)**: 在 Supabase 中为 `profiles` 表启用 RLS
2. **权限策略**: 确保用户只能修改自己的档案
3. **数据验证**: 使用 Zod schema 验证输入数据

### 示例 RLS 策略

```sql
-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 用户可以查看所有档案
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- 用户只能插入自己的档案
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 用户只能更新自己的档案
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## 📝 注意事项

1. **UUID 格式**: 确保前端生成的 UUID 格式正确
2. **数据同步**: 用户注册后需要创建对应的档案记录
3. **错误处理**: 妥善处理认证和数据库操作的错误
4. **类型安全**: 利用 TypeScript 和 Zod 确保类型安全

## 🎉 完成

现在你的应用已经成功集成了 Supabase Auth 和 Profiles 系统！用户可以：

- 使用邮箱和密码注册/登录
- 创建和编辑个人档案
- 查看其他用户的档案
- 安全地管理自己的信息

访问应用的 "用户认证 & 档案" 标签页来体验完整功能。