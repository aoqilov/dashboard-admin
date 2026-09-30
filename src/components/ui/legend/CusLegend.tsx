import { cn } from '@/utils/cn'

export interface LegendItem {
  label: string
  color: string
}

interface CusLegendProps {
  items: LegendItem[]
  className?: string
}

/** ● Current year  ● Last year */
export function CusLegend({ items, className }: CusLegendProps) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5 text-sm text-muted">
          <CusLegendDot color={item.color} />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

interface CusLegendDotProps {
  /** Hex yoki CSS o'zgaruvchi: '#3b7ddd', 'var(--color-dark)' */
  color: string
  className?: string
}

export function CusLegendDot({ color, className }: CusLegendDotProps) {
  return (
    <span
      className={cn('inline-block size-2 shrink-0 rounded-full', className)}
      style={{ backgroundColor: color }}
    />
  )
}
