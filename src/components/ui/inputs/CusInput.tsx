import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface CusInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'disabled'> {
  label?: string
  /** Pastdagi yordamchi matn */
  hint?: string
  /** Xato matni — berilsa input qizil bo'ladi */
  error?: string
  success?: boolean
  leftIcon?: ReactNode
  isDisabled?: boolean
}

export function CusInput({
  label,
  hint,
  error,
  success,
  leftIcon,
  isDisabled,
  className,
  id,
  ...props
}: CusInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-content">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted [&_svg]:size-5">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          disabled={isDisabled}
          aria-invalid={Boolean(error)}
          className={cn(
            'h-10 w-full rounded-control border bg-transparent px-4 text-sm text-heading shadow-xs transition-colors outline-none',
            'placeholder:text-subtle focus:shadow-focus dark:bg-white/3',
            'disabled:cursor-not-allowed disabled:bg-hover disabled:text-muted',
            leftIcon && 'pl-12',
            error
              ? 'border-danger focus:border-danger'
              : success
                ? 'border-success focus:border-success'
                : 'border-border-strong focus:border-primary/60',
          )}
          {...props}
        />
      </div>

      {(error || hint) && (
        <p className={cn('text-xs', error ? 'text-danger' : success ? 'text-success' : 'text-muted')}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}
