import { ClipboardList, Eye, FolderTree, Package } from 'lucide-react'
import { CusCard } from '@/components/shared/card/CusCard'
import { CusStatItem } from '@/components/shared/stat/CusStatItem'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { useAllProducts } from '@/features/products/api-hooks/useProducts'
import { usePendingOrdersCount, useReportSummary } from '../api-hooks/useDashboard'

/** Tepadagi to'rtta raqamli karta */
export function StatCards() {
  const { data: summary, isLoading } = useReportSummary()
  const { data: pending } = usePendingOrdersCount()
  const { data: products } = useAllProducts()

  const cards = [
    { icon: Package, label: 'Mahsulotlar', value: summary?.total_products ?? products?.length, color: 'primary' as const },
    { icon: FolderTree, label: 'Kategoriyalar', value: summary?.total_categories, color: 'info' as const },
    { icon: Eye, label: "Ko'rilgan mahsulotlar", value: summary?.total_viewed_products, color: 'success' as const },
    { icon: ClipboardList, label: 'Tasdiq kutayotgan buyurtmalar', value: pending, color: 'warning' as const },
  ]

  return (
    <>
      {cards.map((card) => (
        <div key={card.label} className="col-span-12 sm:col-span-6 xl:col-span-3">
          <CusCard className="h-full">
            {isLoading && card.value === undefined ? (
              <CusSkeleton height="12" />
            ) : (
              <CusStatItem icon={card.icon} label={card.label} value={card.value ?? '—'} color={card.color} />
            )}
          </CusCard>
        </div>
      ))}
    </>
  )
}
