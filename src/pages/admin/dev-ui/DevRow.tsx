import type { ReactNode } from 'react'
import { CusLabel } from '@/components/ui/typography/CusTypography'
import { cn } from '@/utils/cn'

/** UI Kit sahifasidagi bitta namuna qatori */
export function DevRow({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-5 first:pt-0 last:border-0 last:pb-0">
      <CusLabel className="text-xs font-medium tracking-wide uppercase">{title}</CusLabel>
      <div className={cn('flex flex-wrap items-center gap-3', className)}>{children}</div>
    </div>
  )
}
