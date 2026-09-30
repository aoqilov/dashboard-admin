import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { SOFT_COLORS, SOLID_COLORS, type ColorVariant } from '@/theme/tokens'

const sizes = {
  sm: 'gap-1 px-2 py-0.5 text-xs [&_svg]:size-3',
  md: 'gap-1.5 px-2.5 py-0.5 text-sm [&_svg]:size-3.5',
}

interface CusBadgeProps {
  children: ReactNode
  color?: ColorVariant
  /** light — och fon, solid — to'liq rang */
  variant?: 'light' | 'solid'
  size?: keyof typeof sizes
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
}

/** Holat yoki o'zgarish belgisi — "+19.2%", "Active" */
export function CusBadge({
  children,
  color = 'primary',
  variant = 'light',
  size = 'sm',
  leftIcon,
  rightIcon,
  className,
}: CusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap',
        variant === 'light' ? SOFT_COLORS[color] : SOLID_COLORS[color],
        sizes[size],
        className,
      )}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </span>
  )
}
