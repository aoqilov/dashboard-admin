import { useMemo } from 'react'
import { CircleCheck, ImageOff, Percent, Tag, type LucideIcon } from 'lucide-react'
import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { useDiscountList } from '@/features/discounts/api-hooks/useDiscounts'
import { useAllProducts } from '@/features/products/api-hooks/useProducts'
import { cn } from '@/utils/cn'
import { navigate } from '@/utils/navigate'
import { scheduleStatus } from '@/utils/schedule'
import { daysLeft } from '../utils/dashboard'

interface Issue {
  icon: LucideIcon
  label: string
  /** Muammoli elementlar nomlari (birinchi bir nechtasi ko'rsatiladi) */
  names: string[]
  to: string
}

/** Diqqat talab qiladigan narsalar: narxsiz va rasmsiz mahsulotlar, tez tugaydigan chegirmalar */
export function AttentionCard() {
  const { data: products, isLoading: loadingProducts } = useAllProducts()
  const { data: discounts, isLoading: loadingDiscounts } = useDiscountList()

  const issues = useMemo<Issue[]>(() => {
    const list = products ?? []
    const noPrice = list.filter((p) => (p.is_sellable && !p.price_sale) || (p.is_rentable && !p.price_rental))
    const noPhoto = list.filter((p) => !p.variants.some((variant) => variant.photos.length > 0))
    const ending = (discounts ?? []).filter((d) => {
      const left = daysLeft(d.ends_at)
      return scheduleStatus(d) === 'active' && left !== null && left <= 2
    })
    return [
      { icon: Tag, label: 'Narxi kiritilmagan mahsulotlar', names: noPrice.map((p) => p.name), to: '/products' },
      { icon: ImageOff, label: 'Rasmsiz mahsulotlar', names: noPhoto.map((p) => p.name), to: '/products' },
      { icon: Percent, label: '2 kun ichida tugaydigan chegirmalar', names: ending.map((d) => d.title), to: '/discounts' },
    ]
  }, [products, discounts])

  const hasIssues = issues.some((issue) => issue.names.length > 0)

  return (
    <CusCard className="h-full">
      <CusCardHeader title="Diqqat talab qiladi" />
      {loadingProducts || loadingDiscounts ? (
        <CusSkeleton height="40" />
      ) : !hasIssues ? (
        <p className="flex items-center justify-center gap-2 py-10 text-sm text-success">
          <CircleCheck className="size-4" /> Hammasi joyida
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {issues.map((issue) => (
            <li key={issue.label}>
              <button
                type="button"
                disabled={issue.names.length === 0}
                onClick={() => navigate(issue.to)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-control p-2 text-left transition-colors',
                  issue.names.length ? 'hover:bg-hover' : 'opacity-50',
                )}
              >
                <issue.icon className={cn('mt-0.5 size-4 shrink-0', issue.names.length ? 'text-warning' : 'text-subtle')} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-heading">
                    {issue.label} · <span className="font-semibold">{issue.names.length}</span>
                  </span>
                  {issue.names.length > 0 && (
                    <span className="block truncate text-xs text-muted">
                      {issue.names.slice(0, 3).join(', ')}
                      {issue.names.length > 3 && ' …'}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </CusCard>
  )
}
