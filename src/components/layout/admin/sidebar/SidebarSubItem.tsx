import { ArrowRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SidebarSubItemProps {
  label: string
  active: boolean
  onClick: () => void
}

/** AdminKit uslubi: "→ Nom", faol bo'lsa rangli matn */
export function SidebarSubItem({ label, active, onClick }: SidebarSubItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'mx-3 flex w-[calc(100%-1.5rem)] items-center gap-2.5 rounded-lg py-2 pr-3 pl-9 text-xs transition-colors',
          active ? 'bg-primary/10 text-primary dark:text-primary-light' : 'text-muted hover:bg-hover hover:text-heading',
        )}
      >
        <ArrowRight className="size-3.5 shrink-0" />
        {label}
      </button>
    </li>
  )
}
