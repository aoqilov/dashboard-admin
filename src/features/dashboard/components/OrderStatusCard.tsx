import { BaseChart } from '@/components/charts/BaseChart'
import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { CHART_THEME } from '@/config/charts'
import { useTheme } from '@/hooks/useTheme'
import { usePeriodOrders } from '../api-hooks/useDashboard'
import { ORDER_STATUSES } from '../utils/dashboard'

/** Buyurtmalar holati bo'yicha taqsimot (donut) va ro'yxat */
export function OrderStatusCard({ days }: { days: number }) {
  const { theme } = useTheme()
  const { data: orders, isLoading } = usePeriodOrders(days)

  const counts = ORDER_STATUSES.map((status) => ({
    ...status,
    count: (orders ?? []).filter((order) => order.status === status.value).length,
  }))
  const total = orders?.length ?? 0
  const shown = counts.filter((item) => item.count > 0)

  return (
    <CusCard className="flex h-full flex-col">
      <CusCardHeader title="Buyurtmalar holati" />

      {isLoading ? (
        <CusSkeleton height="64" />
      ) : total === 0 ? (
        <p className="flex flex-1 items-center justify-center py-10 text-sm text-muted">Bu davrda buyurtma yo'q</p>
      ) : (
        <>
          <BaseChart
            type="donut"
            height={190}
            series={shown.map((item) => item.count)}
            options={{
              labels: shown.map((item) => item.label),
              colors: shown.map((item) => item.color),
              stroke: { width: 3, colors: [CHART_THEME[theme].surface] },
              plotOptions: { pie: { donut: { size: '68%' } } },
            }}
          />
          <ul className="mt-4 flex flex-col gap-2">
            {counts.map((item) => (
              <li key={item.value} className="flex items-center gap-2 text-sm">
                <span className="size-2.5 rounded-full" style={{ background: item.color }} />
                <span className="flex-1 text-content">{item.label}</span>
                <span className="font-medium text-heading">{item.count}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </CusCard>
  )
}
