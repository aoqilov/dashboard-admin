import type { GetAllRequest, Paginated } from './common.types'

/** Backend ruxsat bergan eng katta sahifa */
const MAX_PAGE_SIZE = 100

/**
 * Ma'lumotnomalarni (kategoriya, rang, teg...) to'liq oladi — select'lar uchun.
 * 100 tadan ko'p bo'lsa keyingi sahifalarni ham so'raydi.
 */
export async function fetchAll<T>(
  getAll: (body: GetAllRequest) => Promise<Paginated<T>>,
  filters?: Record<string, unknown>,
) {
  const items: T[] = []
  let page = 1
  while (true) {
    const res = await getAll({ page, pageSize: MAX_PAGE_SIZE, filters })
    items.push(...res.items)
    if (page >= res.totalPages) return items
    page++
  }
}
