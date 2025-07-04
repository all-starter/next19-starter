/**
 * API相关的类型定义
 * 使用TypeScript严格类型，PascalCase命名
 */

/**
 * 用户数据接口
 * 定义用户对象的基本结构
 */
export interface User {
  /** 用户唯一标识符 */
  id: number
  /** 用户姓名 */
  name: string
  /** 用户邮箱地址 */
  email: string
  /** 用户创建时间（可选） */
  createdAt?: string
}

/**
 * Hello API响应接口
 * 定义问候API返回的数据结构
 */
export interface HelloResponse {
  /** 问候消息 */
  greeting: string
  /** 响应时间戳 */
  timestamp: string
}

/**
 * 随机数API响应接口
 * 定义随机数生成API返回的数据结构
 */
export interface RandomNumberResponse {
  /** 生成的随机数 */
  number: number
  /** 随机数范围描述 */
  range: string
}

/**
 * 创建用户输入接口
 * 定义创建用户API所需的输入参数
 */
export interface CreateUserInput {
  /** 用户姓名 */
  name: string
  /** 用户邮箱地址 */
  email: string
}

/**
 * Hello API输入接口
 * 定义问候API的输入参数
 */
export interface HelloInput {
  /** 可选的用户名 */
  name?: string
}

/**
 * 随机数API输入接口
 * 定义随机数生成API的输入参数
 */
export interface RandomNumberInput {
  /** 最小值（可选） */
  min?: number
  /** 最大值（可选） */
  max?: number
}

/**
 * 表单状态接口
 * 定义演示组件中表单的状态结构
 */
export interface FormState {
  /** 用户名字段 */
  userName: string
  /** 用户邮箱字段 */
  userEmail: string
  /** 姓名字段 */
  name: string
}

/**
 * API错误接口
 * 定义API调用失败时的错误信息结构
 */
export interface ApiError {
  /** 错误消息 */
  message: string
  /** 错误代码（可选） */
  code?: string
  /** 错误详细信息（可选） */
  details?: unknown
}
