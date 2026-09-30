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
          'flex w-full items-center gap-2.5 py-2 pr-6 pl-10 text-xs transition-colors',
          active ? 'text-primary dark:text-primary-light' : 'text-muted hover:text-heading',
        )}
      >
        <ArrowRight className="size-3.5 shrink-0" />
        {label}
      </button>
    </li>
  )
}
