import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface LayoutOption<T extends string> {
  value: T
  label: string
  icon: LucideIcon
}

interface LayoutSwitchProps<T extends string> {
  options: LayoutOption<T>[]
  value: T
  onChange: (value: T) => void
}

/** Ko'rinish almashtirgich: ikonkali tugmalar guruhi (jadval / to'r / ...) */
export function LayoutSwitch<T extends string>({ options, value, onChange }: LayoutSwitchProps<T>) {
  return (
    <div className="flex items-center gap-0.5 rounded-control border border-border bg-surface p-0.5">
      {options.map(({ value: option, label, icon: Icon }) => (
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
