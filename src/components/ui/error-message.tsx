/**
 * 错误消息显示组件
 * 根据.traerc.json规则：组件使用kebab-case文件名，处理错误状态
 */

import { formatErrorMessage } from '@/utils/helpers'
import { CSS_CLASSES, UI_MESSAGES } from '@/constants/app'

interface ErrorMessageProps {
  error: unknown;
  className?: string;
  showPrefix?: boolean;
}

export const ErrorMessage = ({ 
  error, 
  className = '', 
  showPrefix = true 
}: ErrorMessageProps) => {
  const message = formatErrorMessage(error)
  const displayMessage = showPrefix ? `${UI_MESSAGES.ERROR_PREFIX}${message}` : message

  return (
    <p className={`${CSS_CLASSES.ERROR_TEXT} ${className}`}>
      {displayMessage}
    </p>
  )
}