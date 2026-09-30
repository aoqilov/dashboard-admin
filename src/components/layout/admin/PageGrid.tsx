import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

/** 12 ustunli sahifa gridi. Bolalar col-span-* bilan joylashadi */
export function PageGrid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('grid grid-cols-12 gap-4 md:gap-6 *:min-w-0', className)} {...props} />
}
