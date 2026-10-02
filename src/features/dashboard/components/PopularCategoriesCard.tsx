import { BaseChart } from '@/components/charts/BaseChart'
import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { useTheme } from '@/hooks/useTheme'
import { getAccentColor } from '@/theme/accents'
import { usePopularCategories } from '../api-hooks/useDashboard'

/** Eng mashhur kategoriyalar: ko'rishlar soni bo'yicha gorizontal ustunlar */
export function PopularCategoriesCard({ days }: { days: number }) {
  const { theme, accent } = useTheme()
  const { data, isLoading } = usePopularCategories(days)
  const items = data?.items ?? []

  return (
    <CusCard className="h-full">
      <CusCardHeader title="Mashhur kategoriyalar" />
      {isLoading ? (
        <CusSkeleton height="64" />
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Bu davrda ma'lumot yo'q</p>
      ) : (
        <BaseChart
          type="bar"
          height={Math.max(180, items.length * 44)}
          series={[{ name: "Ko'rishlar", data: items.map((item) => item.view_count) }]}
          options={{
            colors: [getAccentColor(accent, theme)],
            plotOptions: { bar: { horizontal: true, borderRadius: 3, barHeight: '55%' } },
            xaxis: { categories: items.map((item) => item.name) },
            yaxis: { labels: { maxWidth: 110 } },
            grid: { yaxis: { lines: { show: false } } },
          }}
        />
      )}
    </CusCard>
  )
}
