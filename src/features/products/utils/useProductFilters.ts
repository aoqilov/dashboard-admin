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
  'rent_min',
  'rent_max',
  'size_min',
  'size_max',
  'tags',
  'materials',
  'brand',
  'manufacture',
  'date_from',
  'date_to',
  /** 'yes' — rasmi xira, 'no' — oddiy */
  'blur',
  'page',
] as const

export type FilterKey = (typeof KEYS)[number]
export type ProductFilters = Record<FilterKey, string>

/** Drawer'dagi qo'shimcha filtrlar. Oraliq (dan–gacha) bitta filtr hisoblanadi */
export const ADVANCED_GROUPS: FilterKey[][] = [
  ['price_min', 'price_max'],
  ['rent_min', 'rent_max'],
  ['size_min', 'size_max'],
  ['tags'],
  ['materials'],
  ['brand'],
  ['manufacture'],
  ['date_from', 'date_to'],
  ['blur'],
]

export const ADVANCED_KEYS = ADVANCED_GROUPS.flat()

/** URL'dagi "1,2,3" -> [1, 2, 3] */
export const parseIds = (value: string) => value.split(',').map(Number).filter(Boolean)

function range(min: string, max: string) {
  if (!min && !max) return undefined
  return { ...(min && { gte: Number(min) }), ...(max && { lte: Number(max) }) }
}

/** Sana bo'yicha: backend faqat kunni solishtiradi ('2026-09-01') */
function dateRange(from: string, to: string) {
  if (!from && !to) return undefined
  return { ...(from && { gte: from }), ...(to && { lte: to }) }
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
  const rent = range(filters.rent_min, filters.rent_max)
  if (rent) filterBody.price_rental = rent
  const size = range(filters.size_min, filters.size_max)
  if (size) filterBody.size = size
  // Ro'yxat — IN: shu teglardan/materiallardan biri bor mahsulotlar
  if (filters.tags) filterBody.tags = parseIds(filters.tags)
  if (filters.materials) filterBody.materials = parseIds(filters.materials)
  if (filters.brand) filterBody.brand = filters.brand
  if (filters.manufacture) filterBody.manufacture = filters.manufacture
  const created = dateRange(filters.date_from, filters.date_to)
  if (created) filterBody.created_at = created
  if (filters.blur) filterBody.blur_image_in_site = filters.blur === 'yes'

  const body: GetAllRequest = { page, pageSize: PAGE_SIZE, filters: filterBody }
  const activeCount = KEYS.filter((key) => key !== 'page' && filters[key]).length
  const advancedCount = ADVANCED_GROUPS.filter((group) => group.some((key) => filters[key])).length

  return { filters, page, body, update, clear, activeCount, advancedCount }
}
