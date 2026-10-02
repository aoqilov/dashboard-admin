import { useMemo } from 'react'
import { useDiscountList } from '@/features/discounts/api-hooks/useDiscounts'
import { useNewsList } from '@/features/news/api-hooks/useNews'
import { useReportSummary } from '@/features/dashboard/api-hooks/useDashboard'
import { scheduleStatus } from '@/utils/schedule'

/**
 * Menyu bandlari yonidagi sonlar (id -> son), API dan olinadi.
 * Son 0 yoki hali yuklanmagan bo'lsa — belgi ko'rsatilmaydi.
 */
export function useSidebarBadges(): Record<string, number> {
  const { data: summary } = useReportSummary()
  const { data: discounts } = useDiscountList()
  const { data: news } = useNewsList()

  return useMemo(() => {
    const active = <T extends { starts_at?: string | null; ends_at?: string | null; status?: 'draft' | 'active' | 'archived' }>(
      items?: T[],
    ) => (items ?? []).filter((item) => scheduleStatus(item) === 'active').length

    return {
      products: summary?.total_products ?? 0,
      categories: summary?.total_categories ?? 0,
      discounts: active(discounts),
      news: active(news),
    }
  }, [summary, discounts, news])
}
