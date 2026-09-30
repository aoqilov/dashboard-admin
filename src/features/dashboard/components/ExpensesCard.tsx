import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { BaseChart } from '@/components/charts/BaseChart'
import { COLORS } from '@/config/charts'
import { EXPENSES } from '@/data/dashboard'
import { ChartMenuButton } from './ChartMenuButton'

export function ExpensesCard() {
  return (
    <CusCard className="h-full">
      <CusCardHeader title="Expenses" action={<ChartMenuButton />} />
      <BaseChart
        type="area"
        height={240}
        series={[{ name: 'Expenses', data: EXPENSES.values }]}
        options={{
          colors: [COLORS.danger],
          stroke: { curve: 'smooth', width: 3 },
          fill: {
            type: 'gradient',
            gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0, stops: [0, 100] },
          },
          xaxis: { categories: EXPENSES.months },
          yaxis: { min: 0, max: 100, tickAmount: 5 },
        }}
      />
    </CusCard>
  )
}
