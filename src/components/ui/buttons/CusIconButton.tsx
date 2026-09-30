import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import { TEXT_COLORS, type ColorVariant } from '@/theme/tokens'

const variants = {
  /** Fonsiz, faqat hover'da fon */
  ghost: 'hover:bg-hover',
  /** Chegarali — header va ijtimoiy tarmoq tugmalari */
  outline: 'border border-border bg-panel shadow-xs hover:bg-hover',
}

const sizes = {
  sm: 'size-8 [&_svg]:size-4',
  md: 'size-10 [&_svg]:size-5',
}

const shapes = {
  circle: 'rounded-full',
  square: 'rounded-control',
}

interface CusIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  /** Berilmasa — kulrang, hover'da quyuqlashadi */
  color?: ColorVariant
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  shape?: keyof typeof shapes
  /** Tugma ustida pulsatsiyali nuqta (masalan yangi bildirishnoma) */
  dot?: boolean
  /** Ekran o'quvchilar va tooltip uchun */
  label: string
}

export function CusIconButton({
  icon: Icon,
  color,
  variant = 'ghost',
  size = 'md',
  shape = 'circle',
  dot,
  label,
  className,
  ...props
}: CusIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center transition-colors',
        'focus-visible:shadow-focus focus-visible:outline-none',
        color ? TEXT_COLORS[color] : 'text-muted hover:text-heading',
        variants[variant],
        sizes[size],
        shapes[shape],
        className,
      )}
      {...props}
    >
      <Icon strokeWidth={1.8} />
      {dot && (
        <span className="absolute top-0.5 right-0 flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-warning opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-warning" />
        </span>
      )}
    </button>
  )
}
