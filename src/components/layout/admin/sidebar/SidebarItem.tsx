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
  /** Bandning yonidagi son (API dan). 0 yoki yo'q bo'lsa ko'rinmaydi */
  badge?: number
  onToggle: () => void
  onSelect: (id: string) => void
}

export function SidebarItem({ item, open, activeId, compact, badge, onToggle, onSelect }: SidebarItemProps) {
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
          // Yumaloq blok: faol bo'lsa och rangli fon, ramka va yengil soya
          'group mx-3 flex w-[calc(100%-1.5rem)] items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all',
          compact && 'mx-auto w-10 justify-center px-0',
          active
            ? 'border-primary/20 bg-primary/10 text-heading shadow-xs dark:bg-primary/15'
            : 'border-transparent text-content hover:bg-hover hover:text-heading',
        )}
      >
        <span className="relative shrink-0">
          <Icon
            className={cn(
              'size-4.5',
              active ? 'text-primary dark:text-primary-light' : 'text-muted group-hover:text-content',
            )}
            strokeWidth={1.8}
          />
          {/* Yig'ilgan holatda son o'rniga kichik nuqta */}
          {compact && badge ? <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary" /> : null}
        </span>
        {!compact && <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>}
        {!compact && badge ? (
          <span
            className={cn(
              'min-w-5 rounded-full px-1.5 py-0.5 text-center text-2xs leading-none font-medium',
              active ? 'bg-primary text-white' : 'bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary-light',
            )}
          >
            {badge}
          </span>
        ) : null}
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
