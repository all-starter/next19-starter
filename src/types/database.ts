 /**
 * Supabase 数据库类型定义
 * 这些类型应该与实际的数据库模式保持同步
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          avatar_url: string | null
          bio: string | null
          email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          avatar_url?: string | null
          bio?: string | null
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          avatar_url?: string | null
          bio?: string | null
          email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      config: {
        Row: {
          id: number
          key: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          key: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          key?: string
          value?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// 便捷类型别名
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// 用户相关类型
export type User = Tables<'users'>
export type UserInsert = TablesInsert<'users'>
export type UserUpdate = TablesUpdate<'users'>

// 配置相关类型
export type Config = Tables<'config'>
export type ConfigInsert = TablesInsert<'config'>
export type ConfigUpdate = TablesUpdate<'config'>