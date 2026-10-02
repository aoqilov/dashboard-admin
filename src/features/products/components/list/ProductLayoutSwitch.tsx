import { Grid3x3, Grip, LayoutGrid, LayoutList, Table2, type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { ProductLayout } from '../../utils/productLayout'

const OPTIONS: { value: ProductLayout; label: string; icon: LucideIcon }[] = [
  { value: 'table', label: "Jadval", icon: Table2 },
  { value: 'grid12', label: "12 ustunli to'r", icon: Grip },
  { value: 'grid8', label: "8 ustunli to'r", icon: Grid3x3 },
  { value: 'grid6', label: "6 ustunli to'r", icon: LayoutGrid },
  { value: 'grid4', label: "4 ustun: rasm va ma'lumot", icon: LayoutList },
]

interface ProductLayoutSwitchProps {
  value: ProductLayout
  onChange: (value: ProductLayout) => void
}

/** Ko'rinish almashtirgich: jadval / 12 / 8 / 6 / 4 ustun */
export function ProductLayoutSwitch({ value, onChange }: ProductLayoutSwitchProps) {
  return (
    <div className="flex items-center gap-0.5 rounded-control border border-border bg-surface p-0.5">
      {OPTIONS.map(({ value: option, label, icon: Icon }) => (
        <button
          key={option}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            'flex size-8 items-center justify-center rounded-control transition-colors',
            value === option ? 'bg-primary text-white' : 'text-muted hover:bg-hover hover:text-heading',
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  )
}
