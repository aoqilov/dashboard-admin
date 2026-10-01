import { createContext, useCallback, useContext } from 'react'
import { navigate } from '@/utils/navigate'

/**
 * Yengil router (kutubxonasiz).
 * Yo'l shabloni: '/products/:id' -> { id: '12' }
 */
export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)
  if (patternParts.length !== pathParts.length) return null

  const params: Record<string, string> = {}
  for (let i = 0; i < patternParts.length; i++) {
    const part = patternParts[i]
    if (part.startsWith(':')) params[part.slice(1)] = decodeURIComponent(pathParts[i])
    else if (part !== pathParts[i]) return null
  }
  return params
}

export interface RouteState {
  params: Record<string, string>
  search: string
}

export const RouteContext = createContext<RouteState>({ params: {}, search: '' })

/** '/products/:id' dagi parametrlar */
export function useParams() {
  return useContext(RouteContext).params
}

/**
 * URL query (?page=2&category=1).
 * setSearchParams tarixga yangi yozuv qo'shmaydi (replace) — filtrlar uchun.
 */
export function useSearchParams() {
  const { search } = useContext(RouteContext)
  const params = new URLSearchParams(search)

  const setSearchParams = useCallback((next: Record<string, string | null | undefined>) => {
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(next)) {
      if (value !== null && value !== undefined && value !== '') query.set(key, value)
    }
    const qs = query.toString()
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  return [params, setSearchParams] as const
}

export { navigate }
