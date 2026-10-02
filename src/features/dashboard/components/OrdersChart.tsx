import { useMemo } from 'react'
import { BaseChart } from '@/components/charts/BaseChart'
import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusLabel, CusValue } from '@/components/ui/typography/CusTypography'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { CHART_THEME } from '@/config/charts'
import { useTheme } from '@/hooks/useTheme'
import { getAccentColor } from '@/theme/accents'
import { formatPrice } from '@/utils/format'
import { usePeriodOrders } from '../api-hooks/useDashboard'
import { isLostOrder, lastDays, ordersByDay, shortDay } from '../utils/dashboard'

/** Buyurtmalar dinamikasi: har kunga nechta buyurtma; tepada jami soni va tushum */
export function OrdersChart({ days }: { days: number }) {
  const { theme, accent } = useTheme()
  const primary = getAccentColor(accent, theme)
  const { data: orders, isLoading } = usePeriodOrders(days)

  const daily = useMemo(() => ordersByDay(orders ?? [], lastDays(days)), [orders, days])
  const total = orders?.length ?? 0
  const revenue = daily.reduce((sum, item) => sum + item.sum, 0)
  const lost = (orders ?? []).filter(isLostOrder).length

  return (
    <CusCard className="h-full">
      <CusCardHeader title="Buyurtmalar dinamikasi" />
      <div className="mb-4 flex flex-wrap gap-x-10 gap-y-3">
        <div>
          <CusLabel className="text-xs">Buyurtmalar</CusLabel>
          <CusValue size="md">{total}</CusValue>
        </div>
        <div>
          <CusLabel className="text-xs">Tushum (bekor va qaytarilmagan)</CusLabel>
          <CusValue size="md">{formatPrice(revenue) ?? '0 so\'m'}</CusValue>
        </div>
        <div>
          <CusLabel className="text-xs">Bekor / qaytarilgan</CusLabel>
          <CusValue size="md">{lost}</CusValue>
        </div>
      </div>

      {isLoading ? (
        <CusSkeleton height="64" />
      ) : (
        <BaseChart
          type="area"
          height={260}
          series={[{ name: 'Buyurtmalar', data: daily.map((item) => item.count) }]}
          options={{
            colors: [primary],
            stroke: { curve: 'smooth', width: 2 },
            fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.02 } },
            xaxis: {
              categories: daily.map((item) => shortDay(item.day)),
              tickAmount: Math.min(days, 8),
              axisBorder: { show: true, color: CHART_THEME[theme].border },
            },
            yaxis: { min: 0, forceNiceScale: true, labels: { formatter: (value: number) => String(Math.round(value)) } },
            tooltip: {
              y: {
                formatter: (value: number, opts?: { dataPointIndex?: number }) =>
                  `${value} ta · ${formatPrice(daily[opts?.dataPointIndex ?? 0]?.sum) ?? "0 so'm"}`,
              },
            },
          }}
        />
      )}
    </CusCard>
  )
}
