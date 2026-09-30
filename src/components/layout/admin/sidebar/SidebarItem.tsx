import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { MenuItem } from './sidebarNav'
import { SidebarSubItem } from './SidebarSubItem'

interface SidebarItemProps {
  item: MenuItem
  open: boolean
  activeId: string
  /** Yig'ilgan sidebar: faqat ikonka */
  compact: boolean
  onToggle: () => void
  onSelect: (id: string) => void
}

export function SidebarItem({ item, open, activeId, compact, onToggle, onSelect }: SidebarItemProps) {
  const Icon = item.icon
  const hasChildren = Boolean(item.children?.length)
  const active = hasChildren
    ? item.children!.some((child) => child.id === activeId)
    : item.id === activeId

  return (
    <li>
      <button
        type="button"
        title={compact ? item.label : undefined}
        aria-expanded={hasChildren ? open : undefined}
        onClick={hasChildren ? onToggle : () => onSelect(item.id)}
        className={cn(
          'group flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-sm font-medium transition-colors',
          compact && 'justify-center',
          active || (hasChildren && open)
            ? 'bg-primary/8 text-primary dark:bg-primary/12 dark:text-primary-light'
            : 'text-content hover:bg-hover',
        )}
      >
        <Icon
          className={cn(
            'size-6 shrink-0',
            !(active || open) && 'text-muted group-hover:text-content',
          )}
          strokeWidth={1.6}
        />
        {!compact && <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>}
        {!compact && hasChildren && (
          <ChevronDown
            className={cn('size-5 shrink-0 transition-transform duration-200', open && 'rotate-180')}
          />
        )}
      </button>

      {hasChildren && !compact && (
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300',
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <ul className="ml-9 flex flex-col gap-1 overflow-hidden pt-1">
            {item.children!.map((child) => (
              <SidebarSubItem
                key={child.id}
                label={child.label}
                active={child.id === activeId}
                onClick={() => onSelect(child.id)}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}
