import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusLegendDot } from '@/components/ui/legend/CusLegend'
import { SALE_BY_LOCATION } from '@/data/dashboard'

const maxAmount = Math.max(...SALE_BY_LOCATION.map((location) => location.amount))

export function SaleByLocation() {
  return (
    <CusCard className="flex h-full flex-col">
      <CusCardHeader title="Sale by Location" />

      <ul className="flex flex-1 flex-col justify-between gap-5">
        {SALE_BY_LOCATION.map((location) => (
          <li key={location.name}>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-heading">
                <CusLegendDot color={location.color} className="size-2" />
                {location.name}
              </span>
              <span className="font-medium text-heading">${location.amount}k</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-body">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(location.amount / maxAmount) * 100}%`,
                  backgroundColor: location.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </CusCard>
  )
}
