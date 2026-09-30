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
          // AdminKit: chetdan chetgacha, faol bo'lsa chapda rangli chiziq
          'group flex w-full items-center gap-3 border-l-3 px-6 py-2.5 text-sm transition-colors',
          compact && 'justify-center px-0',
          active
            ? 'border-primary bg-linear-to-r from-primary/10 to-transparent text-heading dark:from-primary/15'
            : 'border-transparent text-content hover:text-heading',
        )}
      >
        <Icon
          className={cn(
            'size-4.5 shrink-0',
            active ? 'text-primary dark:text-primary-light' : 'text-muted group-hover:text-content',
          )}
          strokeWidth={1.8}
        />
        {!compact && <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>}
        {!compact && hasChildren && (
          <ChevronDown
            className={cn('size-4 shrink-0 text-muted transition-transform duration-200', open && 'rotate-180')}
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
          <ul className="flex flex-col overflow-hidden">
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
