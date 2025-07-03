/**
 * API相关的类型定义
 * 根据.traerc.json规则：使用TypeScript严格类型，PascalCase命名
 */

// 用户相关类型
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}

// API响应类型
export interface HelloResponse {
  greeting: string;
  timestamp: string;
}

export interface RandomNumberResponse {
  number: number;
  range: string;
}

// 输入类型
export interface CreateUserInput {
  name: string;
  email: string;
}

export interface HelloInput {
  name?: string;
}

export interface RandomNumberInput {
  min?: number;
  max?: number;
}

// 组件状态类型
export interface FormState {
  userName: string;
  userEmail: string;
  name: string;
}

// 错误类型
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}