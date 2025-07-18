/**
 * 应用常量定义
 * 常量使用UPPER_SNAKE_CASE命名
 */

/**
 * API端点常量
 * 定义应用中使用的所有API端点路径
 */
export const API_ENDPOINTS = {
  TRPC: '/api/trpc',
} as const

/**
 * React Query配置常量
 * 定义查询的缓存时间、过期时间和重试次数
 */
export const QUERY_CONFIG = {
  STALE_TIME: 60 * 1000, // 1分钟
  CACHE_TIME: 5 * 60 * 1000, // 5分钟
  RETRY_COUNT: 3,
} as const

/**
 * 随机数生成器默认配置
 * 定义随机数生成的默认最小值和最大值
 */
export const RANDOM_NUMBER_DEFAULTS = {
  MIN: 1,
  MAX: 100,
} as const

/**
 * 用户界面消息常量
 * 定义应用中显示的各种提示消息和文本
 */
export const UI_MESSAGES = {
  LOADING: '加载中...',
  CREATING: '创建中...',
  GENERATING: '生成中...',
  SUCCESS: '操作成功!',
  ERROR_PREFIX: '错误: ',
  USER_CREATED: '用户创建成功!',
  USER_CREATED_SUCCESS: '用户创建成功!',
  DATA_FORMAT_ERROR: '数据格式错误: 期望数组但收到',
} as const

/**
 * 表单验证规则常量
 * 定义用户输入验证的规则和模式
 */
export const VALIDATION = {
  MIN_NAME_LENGTH: 1,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const

/**
 * CSS类名常量
 * 定义应用中常用的Tailwind CSS类名组合
 */
export const CSS_CLASSES = {
  CONTAINER: 'max-w-4xl mx-auto p-6 space-y-8',
  CARD: 'bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md',
  INPUT:
    'w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white',
  BUTTON:
    'w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed',
  BUTTON_PRIMARY:
    'w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed',
  BUTTON_SECONDARY:
    'px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600',
  ERROR_TEXT: 'text-red-500',
  SUCCESS_BOX: 'p-3 bg-green-50 dark:bg-green-900 rounded-md',
  INFO_BOX: 'p-4 bg-gray-50 dark:bg-gray-700 rounded-md',
} as const
