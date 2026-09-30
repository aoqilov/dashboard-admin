import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'
import { TEXT_COLORS, type ColorVariant } from '@/theme/tokens'

type TextProps = HTMLAttributes<HTMLElement>

// ─── Title ────────────────────────────────────────────────────────────────────

const titleSizes = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-2xl',
}

interface CusTitleProps extends TextProps {
  size?: keyof typeof titleSizes
  as?: 'h1' | 'h2' | 'h3' | 'h4'
}

/** Sarlavha — karta (md) yoki sahifa (lg) */
export function CusTitle({ className, size = 'md', as: Tag = 'h3', ...props }: CusTitleProps) {
  return (
    <Tag className={cn('font-semibold text-heading', titleSizes[size], className)} {...props} />
  )
}

// ─── Label ────────────────────────────────────────────────────────────────────

/** Ikkinchi darajali matn — "Total Req. Tickets", "First Name" */
export function CusLabel({ className, ...props }: TextProps) {
  return <p className={cn('text-sm text-muted', className)} {...props} />
}

// ─── Value ────────────────────────────────────────────────────────────────────

const valueSizes = {
  sm: 'text-sm font-medium',
  md: 'text-xl font-semibold',
  lg: 'text-3xl font-bold',
}

interface CusValueProps extends TextProps {
  color?: ColorVariant | 'heading'
  size?: keyof typeof valueSizes
}

/** Asosiy qiymat — "842", "$5024.23", "Musharof" */
export function CusValue({ className, color = 'heading', size = 'lg', ...props }: CusValueProps) {
  return (
    <p
      className={cn(
        'leading-tight',
        valueSizes[size],
        color === 'heading' ? 'text-heading' : TEXT_COLORS[color],
        className,
      )}
      {...props}
    />
  )
}
