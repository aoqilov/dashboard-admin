import { useQuery } from '@tanstack/react-query'
import { fetchAll } from '@/api/fetchAll'
import { storeOrders } from '@/api/routes/stores-orders/storeOrders.api'
import { storeReports } from '@/api/routes/stores-reports/storeReports.api'
import { periodStart } from '../utils/dashboard'

const STALE = 60_000

/** Umumiy raqamlar: mahsulotlar, kategoriyalar, ko'rilgan mahsulotlar */
export function useReportSummary() {
  return useQuery({ queryKey: ['reports', 'summary'], queryFn: storeReports.summary, staleTime: STALE })
}

/** Eng ko'p ko'rilgan / saqlangan mahsulotlar (top 5) */
export function useTopProducts(kind: 'viewed' | 'favorited', days: number) {
  return useQuery({
    queryKey: ['reports', kind, days],
    queryFn: async () => {
      const body = { page: 1, pageSize: 5, from_date: periodStart(days) }
      // Ikkala hisobot ham bir xil ko'rinishga keltiriladi
      if (kind === 'viewed') {
        const res = await storeReports.mostViewedProducts(body)
        return res.items.map((item) => ({ id: item.id, name: item.name, category: item.category, count: item.view_count }))
      }
      const res = await storeReports.mostFavoritedProducts(body)
      return res.items.map((item) => ({ id: item.id, name: item.name, category: item.category, count: item.favorite_count }))
    },
    staleTime: STALE,
  })
}

/** Eng mashhur kategoriyalar (top 6) */
export function usePopularCategories(days: number) {
  return useQuery({
    queryKey: ['reports', 'categories', days],
    queryFn: () => storeReports.mostPopularCategories({ page: 1, pageSize: 6, from_date: periodStart(days) }),
    staleTime: STALE,
  })
}

/** Davr ichidagi barcha buyurtmalar (holat va dinamika grafiklari uchun) */
export function usePeriodOrders(days: number) {
  return useQuery({
    queryKey: ['orders', 'period', days],
    queryFn: () => fetchAll(storeOrders.getAll, { created_at: { gte: periodStart(days) } }),
    staleTime: STALE,
  })
}

/** Tasdiq kutayotgan buyurtmalar soni (davrdan qat'i nazar) */
export function usePendingOrdersCount() {
  return useQuery({
    queryKey: ['orders', 'pending-count'],
    queryFn: async () => (await storeOrders.getAll({ page: 1, pageSize: 1, filters: { status: 'pending_confirmation' } })).total,
    staleTime: STALE,
  })
}
