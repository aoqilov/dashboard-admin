import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { BaseChart } from '@/components/charts/BaseChart'
import { CusLabel, CusValue } from '@/components/ui/typography/CusTypography'
import { CHART_THEME, COLORS } from '@/config/charts'
import { useTheme } from '@/hooks/useTheme'
import { ANALYTIC } from '@/data/dashboard'

export function AnalyticCard() {
  const { theme } = useTheme()

  return (
    <CusCard className="flex h-full flex-col">
      <CusCardHeader title="Analytic" className="mb-0" />

      <div className="flex flex-1 items-center justify-center">
        <BaseChart
          type="donut"
          height={200}
          series={[ANALYTIC.booked, ANALYTIC.cancelled]}
          options={{
            labels: ['Booked', 'Cancelled'],
            colors: [COLORS.primary, COLORS.danger],
            stroke: { width: 3, colors: [CHART_THEME[theme].surface] },
            plotOptions: { pie: { donut: { size: '68%' } } },
            tooltip: { y: { formatter: (value: number) => `${value}%` } },
          }}
        />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <CusLabel className="text-xs">Booked</CusLabel>
          <CusValue size="md">{ANALYTIC.booked}%</CusValue>
        </div>
        <div className="text-right">
          <CusLabel className="text-xs">Cancelled</CusLabel>
          <CusValue size="md">{ANALYTIC.cancelled}%</CusValue>
        </div>
      </div>
    </CusCard>
  )
}
