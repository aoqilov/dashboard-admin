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
import { matchPath, RouteContext, type RouteState } from '@/router/router'
import { navigate } from '@/utils/navigate'

interface RouteConfig {
  /** '/products/:id' kabi parametrli bo'lishi mumkin */
  path: string
  page: ComponentType
  /** sidebar/header'siz, alohida sahifa (login) */
  public?: boolean
  /** Sidebar'da qaysi element faol bo'lsin (ichki sahifalar uchun) */
  nav?: string
}

/**
 * id -> sahifa va URL. Sidebar id lari sidebarNav.ts bilan mos bo'lishi kerak.
 * Tartib muhim: aniq yo'l ('/x/new') parametrli yo'ldan ('/x/:id') oldin.
 */
const ROUTES: Record<string, RouteConfig> = {
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

function resolveRoute() {
  const { pathname, search } = window.location
  for (const [id, route] of Object.entries(ROUTES)) {
    const params = matchPath(route.path, pathname)
    if (params) return { id, params, search }
  }
  return { id: 'overview', params: {}, search }
}

function App() {
  const [current, setCurrent] = useState(resolveRoute)
  const route = ROUTES[current.id]
  const Page = route.page

  // Brauzerning "orqaga / oldinga" tugmalari va navigate()
  useEffect(() => {
    const handlePopState = () => setCurrent(resolveRoute())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const routeState: RouteState = { params: current.params, search: current.search }
  // Parametr o'zgarsa (/products/1 -> /products/2) sahifa qaytadan quriladi
  const pageKey = `${current.id}:${JSON.stringify(current.params)}`

  if (route.public) {
    return (
      <RouteContext.Provider value={routeState}>
        <Page key={pageKey} />
      </RouteContext.Provider>
    )
  }

  return (
    <RouteContext.Provider value={routeState}>
      <AppLayout activeId={route.nav ?? current.id} onNavigate={(id) => navigate(ROUTES[id]?.path ?? '/')}>
        <Page key={pageKey} />
      </AppLayout>
    </RouteContext.Provider>
  )
}

export default App
