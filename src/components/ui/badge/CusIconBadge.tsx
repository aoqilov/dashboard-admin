import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import { SOFT_COLORS, type ColorVariant } from '@/theme/tokens'

const sizes = {
  sm: 'size-10 [&_svg]:size-5',
  md: 'size-12 [&_svg]:size-6',
  lg: 'size-14 [&_svg]:size-7',
}

const shapes = {
  square: 'rounded-xl',
  circle: 'rounded-full',
}

interface CusIconBadgeProps {
  icon: LucideIcon
  /** Berilmasa — neytral kulrang fon (TailAdmin stat kartalari kabi) */
  color?: ColorVariant
  size?: keyof typeof sizes
  shape?: keyof typeof shapes
  className?: string
}

/** Fon ichidagi ikonka — stat kartalar, ro'yxat elementlari */
export function CusIconBadge({ icon: Icon, color, size = 'md', shape = 'square', className }: CusIconBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        color ? SOFT_COLORS[color] : 'bg-hover text-heading',
        sizes[size],
        shapes[shape],
        className,
      )}
    >
      <Icon strokeWidth={1.8} />
    </span>
  )
}
