import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { BaseChart } from '@/components/charts/BaseChart'
import { CHART_THEME, COLORS } from '@/config/charts'
import { useTheme } from '@/hooks/useTheme'
import { EARNING } from '@/data/dashboard'

export function TotalEarning() {
  const { theme } = useTheme()

  return (
    <CusCard className="flex-1">
      <CusCardHeader title="Total Earning" className="mb-3" />
      <p className="text-2xl font-medium text-heading">
        <span className="text-base">$</span>
        {EARNING.total}
      </p>

      <BaseChart
        type="bar"
        height={150}
        className="mt-4"
        series={[{ name: 'Earning', data: EARNING.values }]}
        options={{
          colors: [COLORS.primary],
          plotOptions: { bar: { columnWidth: '12%', borderRadius: 1 } },
          grid: { yaxis: { lines: { show: false } } },
          xaxis: { categories: EARNING.months, axisBorder: { show: true, color: CHART_THEME[theme].border } },
          yaxis: { min: 0, max: 120, tickAmount: 4 },
        }}
      />
    </CusCard>
  )
}
