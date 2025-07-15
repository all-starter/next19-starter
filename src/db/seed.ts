import { db } from './index'
import { profiles } from './schema'

/**
 * 数据库种子脚本
 * 用于初始化开发环境的测试数据
 */
async function seed() {
  console.log('🌱 开始播种数据库...')

  try {
    // 清空现有数据（开发环境）
    console.log('🗑️  清空现有用户数据...')
    await db.delete(profiles)

    // 插入初始用户数据
    console.log('👥 插入初始用户数据...')
    const seedUsers = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        bio: '前端开发工程师，热爱 React 和 TypeScript',
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        bio: '全栈开发者，专注于 Node.js 和数据库设计',
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        bio: 'UI/UX 设计师，关注用户体验和界面设计',
      },
      {
        name: '张三',
        email: 'zhangsan@example.com',
        bio: '后端开发工程师，擅长微服务架构',
      },
      {
        name: '李四',
        email: 'lisi@example.com',
        bio: 'DevOps 工程师，专注于云原生技术',
      },
    ]

    const insertedUsers = await db.insert(profiles).values(seedUsers).returning()

    console.log(`✅ 成功插入 ${insertedUsers.length} 个用户`)
    console.log('📊 插入的用户数据:')
    insertedUsers.forEach((user) => {
      console.log(`  - ${user.name} (${user.email})`)
    })

    console.log('🎉 数据库播种完成！')
  } catch (error) {
    console.error('❌ 数据库播种失败:', error)
    process.exit(1)
  }
}

// 运行种子脚本
seed()
  .then(() => {
    console.log('🏁 种子脚本执行完成')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 种子脚本执行失败:', error)
    process.exit(1)
  })