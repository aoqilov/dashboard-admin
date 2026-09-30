import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

const variants = {
  primary: 'bg-primary text-white shadow-xs hover:bg-primary-dark disabled:bg-primary/50',
  outline:
    'border border-border-strong bg-surface text-content shadow-xs hover:bg-hover hover:text-heading',
  ghost: 'text-content hover:bg-hover hover:text-heading',
  danger: 'bg-danger text-white shadow-xs hover:bg-danger/90 disabled:bg-danger/50',
}

const sizes = {
  sm: 'h-9 gap-1.5 px-3.5 text-sm [&_svg]:size-4',
  md: 'h-11 gap-2 px-4 text-sm [&_svg]:size-[18px]',
  lg: 'h-12 gap-2 px-5 text-base [&_svg]:size-5',
}

interface CusButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  /** Profil sahifasidagi "Edit" kabi to'liq dumaloq tugma */
  rounded?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isLoading?: boolean
  isDisabled?: boolean
  fullWidth?: boolean
}

export function CusButton({
  variant = 'primary',
  size = 'md',
  rounded,
  leftIcon,
  rightIcon,
  isLoading,
  isDisabled,
  fullWidth,
  className,
  children,
  type = 'button',
  ...props
}: CusButtonProps) {
  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors',
        'focus-visible:shadow-focus focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-60',
        rounded ? 'rounded-full' : 'rounded-control',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {isLoading ? <LoaderCircle className="animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  )
}
