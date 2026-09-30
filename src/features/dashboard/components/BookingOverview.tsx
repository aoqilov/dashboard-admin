import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { BaseChart } from '@/components/charts/BaseChart'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { CusLegend } from '@/components/ui/legend/CusLegend'
import { CusLabel } from '@/components/ui/typography/CusTypography'
import { COLORS } from '@/config/charts'
import { BOOKING_OVERVIEW } from '@/data/dashboard'
import { useTheme } from '@/hooks/useTheme'
import { getAccentColor } from '@/theme/accents'
import { ChartMenuButton } from './ChartMenuButton'

const { months, current, last } = BOOKING_OVERVIEW

function Summary({ title, total, change }: { title: string; total: string; change: string }) {
  const positive = change.startsWith('+')
  return (
    <div>
      <CusLabel>{title}</CusLabel>
      <p className="mt-1 flex items-center gap-2 text-base font-semibold text-heading">
        {total}
        <CusBadge color={positive ? 'success' : 'danger'}>{change}</CusBadge>
      </p>
    </div>
  )
}

export function BookingOverview() {
  const { theme, accent } = useTheme()
  const primary = getAccentColor(accent, theme)

  return (
    <CusCard className="h-full">
      <CusCardHeader title="Booking Overview" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
          <Summary title="Current year" {...current} />
          <Summary title="Last year" {...last} />
          <CusLegend
            items={[
              { label: 'Current year', color: primary },
              { label: 'Last year', color: COLORS.danger },
            ]}
          />
        </div>
        <ChartMenuButton />
      </div>

      <BaseChart
        type="line"
        height={290}
        className="mt-4"
        series={[
          { name: 'Current year', data: current.data },
          { name: 'Last year', data: last.data },
        ]}
        options={{
          colors: [primary, COLORS.danger],
          stroke: { curve: 'smooth', width: 3 },
          markers: { size: 5, strokeWidth: 0, hover: { size: 7 } },
          xaxis: { categories: months },
          yaxis: {
            min: 0,
            max: 160,
            tickAmount: 4,
            labels: { formatter: (value: number) => `${value}K` },
          },
        }}
      />
    </CusCard>
  )
}
