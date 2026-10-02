import { useState } from 'react'
import { cn } from '@/utils/cn'
import { SIDEBAR_NAV } from './sidebarNav'
import { SidebarGroup } from './SidebarGroup'
import { SidebarItem } from './SidebarItem'
import { SidebarLogo } from './SidebarLogo'
import { useSidebarBadges } from './useSidebarBadges'

function findParentId(activeId: string) {
  for (const group of SIDEBAR_NAV) {
    for (const item of group.items) {
      if (item.children?.some((child) => child.id === activeId)) return item.id
    }
  }
  return null
}

interface SidebarProps {
  /** Desktop: ikonkalargacha yig'ilgan */
  collapsed: boolean
  /** Mobil: drawer ochiq */
  mobileOpen: boolean
  activeId: string
  onNavigate: (id: string) => void
  onClose: () => void
}

export function Sidebar({ collapsed, mobileOpen, activeId, onNavigate, onClose }: SidebarProps) {
  // Boshida faol sahifaning ota-menyusi ochiq turadi
  const [openItemId, setOpenItemId] = useState<string | null>(() => findParentId(activeId))
  const [hovered, setHovered] = useState(false)
  const badges = useSidebarBadges()

  // Yig'ilgan sidebar sichqoncha ustiga kelganda vaqtincha ochiladi
  const expanded = !collapsed || hovered || mobileOpen
  const compact = !expanded

  return (
    <>
      {/* Mobil fon qoplamasi */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-panel shadow-card transition-all duration-300',
          expanded ? 'w-sidebar' : 'w-sidebar-collapsed',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className={cn('flex h-header shrink-0 items-center px-6', compact && 'justify-center px-0')}>
          <SidebarLogo compact={compact} />
        </div>

        <nav className="flex-1 overflow-x-hidden overflow-y-auto pt-2 pb-8">
          {SIDEBAR_NAV.map((group, index) => (
            <SidebarGroup key={group.title} title={group.title} compact={compact} divider={index > 0}>
              {group.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  compact={compact}
                  open={openItemId === item.id}
                  activeId={activeId}
                  badge={badges[item.id]}
                  onToggle={() => setOpenItemId((prev) => (prev === item.id ? null : item.id))}
                  onSelect={onNavigate}
                />
              ))}
            </SidebarGroup>
          ))}
        </nav>
      </aside>
    </>
  )
}
