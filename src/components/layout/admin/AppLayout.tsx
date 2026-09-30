import { useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Header } from './header/Header'
import { Sidebar } from './sidebar/Sidebar'

interface AppLayoutProps {
  children: ReactNode
  /** Sidebar'dagi faol element id si */
  activeId: string
  onNavigate: (id: string) => void
}

const DESKTOP_QUERY = '(min-width: 1024px)'

/**
 * [ Sidebar | Header          ]
 * [         | Content (full)  ]
 */
export function AppLayout({ children, activeId, onNavigate }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // ☰: desktop'da sidebar'ni yig'adi, mobilda drawer'ni ochadi
  const handleMenuClick = () => {
    if (window.matchMedia(DESKTOP_QUERY).matches) {
      setCollapsed((prev) => !prev)
    } else {
      setMobileOpen((prev) => !prev)
    }
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        activeId={activeId}
        onNavigate={(id) => {
          onNavigate(id)
          setMobileOpen(false)
        }}
        onClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          'transition-[margin] duration-300',
          collapsed ? 'lg:ml-sidebar-collapsed' : 'lg:ml-sidebar',
        )}
      >
        <Header mobileOpen={mobileOpen} onMenuClick={handleMenuClick} />
        <main className="w-full p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
