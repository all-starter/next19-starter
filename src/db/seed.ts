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
    console.log('🗑️  清空现有用户档案数据...')
    await db.delete(profiles)

    // 插入初始用户档案数据
    console.log('👥 插入初始用户档案数据...')
    const seedProfiles = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        nickname: 'Alice Johnson',
        bio: '前端开发工程师，热爱 React 和 TypeScript',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        nickname: 'Bob Smith',
        bio: '全栈开发者，专注于 Node.js 和数据库设计',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        nickname: 'Charlie Brown',
        bio: 'UI/UX 设计师，关注用户体验和界面设计',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        nickname: '张三',
        bio: '后端开发工程师，擅长微服务架构',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        nickname: '李四',
        bio: 'DevOps 工程师，专注于云原生技术',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      },
    ]

    const insertedProfiles = await db.insert(profiles).values(seedProfiles).returning()

    console.log(`✅ 成功插入 ${insertedProfiles.length} 个用户档案`)
    console.log('📊 插入的用户数据:')
    insertedProfiles.forEach((profile) => {
      console.log(`  - ${profile.nickname} (${profile.id})`)
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