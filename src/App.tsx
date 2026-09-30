import { useEffect, useState, type ComponentType } from 'react'
import { AppLayout } from '@/components/layout/admin/AppLayout'
import Categories from '@/pages/admin/Categories'
import DevUI from '@/pages/admin/DevUI'
import Discounts from '@/pages/admin/Discounts'
import Dashboard from '@/pages/admin/main/Dashboard'
import News from '@/pages/admin/News'
import Products from '@/pages/admin/Products'
import Settings from '@/pages/admin/Settings'
import Store from '@/pages/admin/Store'
import Login from '@/pages/Login'

/**
 * Router ulanguncha: sidebar'dagi id -> sahifa va URL.
 * id lar sidebarNav.ts bilan mos bo'lishi kerak.
 * public: true — sidebar/header'siz, alohida sahifa (login)
 */
const ROUTES: Record<string, { path: string; page: ComponentType; public?: boolean }> = {
  login: { path: '/login', page: Login, public: true },
  overview: { path: '/', page: Dashboard },
  products: { path: '/products', page: Products },
  categories: { path: '/categories', page: Categories },
  discounts: { path: '/discounts', page: Discounts },
  news: { path: '/news', page: News },
  store: { path: '/store', page: Store },
  settings: { path: '/settings', page: Settings },
  'ui-kit': { path: '/preview-dev', page: DevUI },
}

function getIdFromPath(pathname: string) {
  return Object.keys(ROUTES).find((id) => ROUTES[id].path === pathname) ?? 'overview'
}

function App() {
  const [activeId, setActiveId] = useState(() => getIdFromPath(window.location.pathname))
  const Page = ROUTES[activeId]?.page ?? Dashboard

  // Brauzerning "orqaga / oldinga" tugmalari
  useEffect(() => {
    const handlePopState = () => setActiveId(getIdFromPath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigate = (id: string) => {
    const path = ROUTES[id]?.path ?? '/'
    if (path !== window.location.pathname) window.history.pushState(null, '', path)
    setActiveId(id)
  }

  if (ROUTES[activeId]?.public) return <Page />

  return (
    <AppLayout activeId={activeId} onNavigate={handleNavigate}>
      <Page />
    </AppLayout>
  )
}

export default App
