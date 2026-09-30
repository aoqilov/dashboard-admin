import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusStatItem } from '@/components/shared/stat/CusStatItem'
import { SALES_STATS } from '@/data/dashboard'

export function TravelSalesStats() {
  return (
    <CusCard className="h-full">
      <CusCardHeader title="Travel Sales Stats" />
      <div className="grid gap-x-6 gap-y-10 py-4 sm:grid-cols-2">
        {SALES_STATS.map((stat) => (
          <CusStatItem key={stat.label} {...stat} />
        ))}
      </div>
    </CusCard>
  )
}
