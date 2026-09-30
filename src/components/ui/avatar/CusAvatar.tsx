import { cn } from '@/utils/cn'

const sizes = {
  xs: 'size-6 text-2xs',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-11 text-sm',
  xl: 'size-14 text-base',
  '2xl': 'size-20 text-xl',
}

/** Holat nuqtasining o'lchami avatar o'lchamiga mos */
const statusSizes: Record<keyof typeof sizes, string> = {
  xs: 'size-1.5',
  sm: 'size-2',
  md: 'size-2.5',
  lg: 'size-3',
  xl: 'size-3.5',
  '2xl': 'size-4',
}

const statusColors = {
  online: 'bg-success',
  offline: 'bg-danger',
  busy: 'bg-warning',
}

interface CusAvatarProps {
  name: string
  src?: string
  size?: keyof typeof sizes
  status?: keyof typeof statusColors
  className?: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Rasm bo'lmasa ism bosh harflari ko'rsatiladi */
export function CusAvatar({ name, src, size = 'md', status, className }: CusAvatarProps) {
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-full border border-border object-cover', sizes[size])}
        />
      ) : (
        <span
          aria-label={name}
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-primary/10 font-semibold text-primary dark:bg-primary/15 dark:text-primary-light',
            sizes[size],
          )}
        >
          {getInitials(name)}
        </span>
      )}
      {status && (
        <span
          className={cn(
            'absolute right-0 bottom-0 rounded-full border-[1.5px] border-panel',
            statusSizes[size],
            statusColors[status],
          )}
        />
      )}
    </span>
  )
}
