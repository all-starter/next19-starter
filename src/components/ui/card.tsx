/**
 * 卡片容器组件
 * 根据.traerc.json规则：组件使用kebab-case文件名，支持响应式设计
 */

import { CSS_CLASSES } from '@/constants/app'

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ title, children, className = '' }: CardProps) => {
  return (
    <div className={`${CSS_CLASSES.CARD} ${className}`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  )
}