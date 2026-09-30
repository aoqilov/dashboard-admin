// Bir nechta route'da ishlatiladigan umumiy tiplar

/** Har bir `get-all` javobi */
export interface Paginated<T> {
  items: T[]
  page: number
  totalPages: number
  total: number
}

/** `get-all` so'rovi — sahifa + filtrlar */
export interface GetAllRequest {
  page?: number
  pageSize?: number
  filters?: Record<string, unknown>
}

/** Filtrsiz sahifalash (favorites) */
export interface PageRequest {
  page?: number
  pageSize?: number
}

/** Rasm qayta ishlanish holati (kategoriya muqovasi, mahsulot rasmi, avatar) */
export type PhotoProcessingStatus = 'pending' | 'ready' | 'failed'

/** Kontent holati (yangilik, chegirma) */
export type ContentStatus = 'draft' | 'active' | 'archived'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  login: string
  password: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}
