import { Eye, Heart } from 'lucide-react'
import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { useCategories } from '@/features/categories/api-hooks/useCategories'
import { useAllProducts } from '@/features/products/api-hooks/useProducts'
import { ProductImage } from '@/features/products/components/shared/ProductBits'
import { productCover } from '@/features/products/utils/productView'
import { formatCompact } from '@/utils/format'
import { navigate } from '@/utils/navigate'
import { useTopProducts } from '../api-hooks/useDashboard'

interface TopProductsCardProps {
  kind: 'viewed' | 'favorited'
  days: number
}

/** Eng ko'p ko'rilgan yoki saqlangan mahsulotlar (top 5). Qatorni bossangiz mahsulotlar sahifasi ochiladi */
export function TopProductsCard({ kind, days }: TopProductsCardProps) {
  const { data, isLoading } = useTopProducts(kind, days)
  const { data: products = [] } = useAllProducts()
  const { data: tree } = useCategories()

  const items = data ?? []
  const max = Math.max(1, ...items.map((item) => item.count))
  const byId = new Map(products.map((product) => [product.id, product]))
  const Icon = kind === 'viewed' ? Eye : Heart

  return (
    <CusCard className="h-full">
      <CusCardHeader title={kind === 'viewed' ? "Eng ko'p ko'rilgan mahsulotlar" : 'Eng ko\'p saqlangan mahsulotlar'} />

      {isLoading ? (
        <CusSkeleton height="64" />
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Bu davrda ma'lumot yo'q</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item, index) => {
            const product = byId.get(item.id)
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/products?q=${encodeURIComponent(item.name)}`)}
                  className="flex w-full items-center gap-3 rounded-control p-1.5 text-left transition-colors hover:bg-hover"
                >
                  <span className="w-4 shrink-0 text-center text-xs font-medium text-subtle">{index + 1}</span>
                  <ProductImage src={product ? productCover(product) : undefined} className="size-11 rounded-control" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-heading">{item.name}</p>
                    <p className="truncate text-xs text-muted">{tree?.byId.get(item.category)?.name ?? '—'}</p>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-hover">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(item.count / max) * 100}%` }} />
                    </div>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-heading">
                    <Icon className="size-3.5 text-muted" /> {formatCompact(item.count)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </CusCard>
  )
}
