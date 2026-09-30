import { cn } from '@/utils/cn'

interface SidebarSubItemProps {
  label: string
  active: boolean
  onClick: () => void
}

export function SidebarSubItem({ label, active, onClick }: SidebarSubItemProps) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full items-center rounded-control px-3 py-2.5 text-sm font-medium transition-colors',
          active
            ? 'bg-primary/8 text-primary dark:bg-primary/12 dark:text-primary-light'
            : 'text-content hover:bg-hover',
        )}
      >
        {label}
      </button>
    </li>
  )
}
