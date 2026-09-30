import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { CusTitle } from '@/components/ui/typography/CusTypography'

// ─── Card ─────────────────────────────────────────────────────────────────────

type CusCardProps = HTMLAttributes<HTMLDivElement>

export function CusCard({ className, ...props }: CusCardProps) {
  return (
    <div
      className={cn('rounded-card bg-surface p-5 shadow-card sm:p-6', className)}
      {...props}
    />
  )
}

// ─── CardHeader ───────────────────────────────────────────────────────────────

interface CusCardHeaderProps {
  title: ReactNode
  /** O'ng tomondagi element (masalan ≡ menyu tugmasi) */
  action?: ReactNode
  className?: string
}

export function CusCardHeader({ title, action, className }: CusCardHeaderProps) {
  return (
    <div className={cn('mb-5 flex items-center justify-between gap-3', className)}>
      <CusTitle size="sm" className="text-muted dark:text-heading">
        {title}
      </CusTitle>
      {action}
    </div>
  )
}
