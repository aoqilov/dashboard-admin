import { useMemo } from 'react'
import type { StoreDiscount } from '@/api/routes/stores-discounts/storeDiscounts.types'
import { ScheduleStatusBadge } from '@/components/shared/status/ScheduleStatusBadge'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { useAllProducts } from '@/features/products/api-hooks/useProducts'
import { ContentInfoLayout } from '@/features/store/components/ContentInfoLayout'
import { photoUrl } from '@/utils/media'
import { formatPeriod, scheduleStatus } from '@/utils/schedule'
import { formatRule } from '../utils/discountPrice'

interface DiscountInfoModalProps {
  item: StoreDiscount
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
}

/** Chegirma haqida ma'lumot (faqat ko'rish): chapda tafsilotlar, o'ngda chegirmadagi mahsulotlar */
export function DiscountInfoModal({ item, open, onOpenChange, onEdit }: DiscountInfoModalProps) {
  const { data: all = [], isLoading } = useAllProducts()
  const rules = useMemo(() => new Map((item.products ?? []).map((row) => [row.product, row])), [item.products])
  const products = useMemo(() => all.filter((product) => rules.has(product.id)), [all, rules])

  return (
    <ContentInfoLayout
      open={open}
      onOpenChange={onOpenChange}
      title={item.title}
      description={item.description}
      image={photoUrl(item.image ?? undefined, 'medium')}
      badges={<ScheduleStatusBadge status={scheduleStatus(item)} />}
      details={[
        { label: 'Muddati', value: formatPeriod(item.starts_at, item.ends_at) },
        { label: 'Mahsulotlar', value: `${item.products?.length ?? 0} ta` },
      ]}
      products={products}
      productsLoading={isLoading}
      productOverlay={(product) => {
        const rule = rules.get(product.id)
        if (!rule) return null
        return (
          <CusBadge color="danger">-{formatRule({ type: rule.discount_type, value: Number(rule.value) })}</CusBadge>
        )
      }}
      onEdit={onEdit}
    />
  )
}
