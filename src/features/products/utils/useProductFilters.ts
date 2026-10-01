import type { GetAllRequest } from '@/api/common.types'
import { useSearchParams } from '@/router/router'

export const PAGE_SIZE = 20

/** URL query kalitlari */
const KEYS = [
  'q',
  'category',
  'subcategory',
  'color',
  'mode',
  'price_min',
  'price_max',
  'size_min',
  'size_max',
  'page',
] as const

export type FilterKey = (typeof KEYS)[number]
export type ProductFilters = Record<FilterKey, string>

/** Drawer'dagi qo'shimcha filtrlar (sonini ko'rsatish uchun) */
export const ADVANCED_KEYS: FilterKey[] = ['price_min', 'price_max', 'size_min', 'size_max']

function range(min: string, max: string) {
  if (!min && !max) return undefined
  return { ...(min && { gte: Number(min) }), ...(max && { lte: Number(max) }) }
}

/**
 * Filtrlar URL'da saqlanadi: sahifani yangilash, "orqaga" va havolani ulashish ishlaydi.
 * Filtr o'zgarsa sahifa 1 ga qaytadi.
 */
export function useProductFilters() {
  const [params, setParams] = useSearchParams()
  const filters = Object.fromEntries(KEYS.map((key) => [key, params.get(key) ?? ''])) as ProductFilters
  const page = Math.max(1, Number(filters.page) || 1)

  const update = (patch: Partial<ProductFilters>) => {
    setParams({ ...filters, page: '', ...patch })
  }

  const clear = () => setParams({})

  const filterBody: Record<string, unknown> = {}
  if (filters.q) filterBody.name = filters.q
  if (filters.category) filterBody.category = Number(filters.category)
  if (filters.subcategory) filterBody.subcategory = Number(filters.subcategory)
  if (filters.color) filterBody.color = Number(filters.color)
  if (filters.mode === 'sale') filterBody.is_sellable = true
  if (filters.mode === 'rent') filterBody.is_rentable = true
  const price = range(filters.price_min, filters.price_max)
  if (price) filterBody.price_sale = price
  const size = range(filters.size_min, filters.size_max)
  if (size) filterBody.size = size

  const body: GetAllRequest = { page, pageSize: PAGE_SIZE, filters: filterBody }
  const activeCount = KEYS.filter((key) => key !== 'page' && filters[key]).length

  return { filters, page, body, update, clear, activeCount }
}
