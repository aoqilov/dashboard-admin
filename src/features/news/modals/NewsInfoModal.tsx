import { useMemo } from 'react'
import type { StoreNews } from '@/api/routes/stores-news/storeNews.types'
import { ScheduleStatusBadge } from '@/components/shared/status/ScheduleStatusBadge'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { useAllProducts } from '@/features/products/api-hooks/useProducts'
import { ContentInfoLayout } from '@/features/store/components/ContentInfoLayout'
import { photoUrl } from '@/utils/media'
import { formatPeriod, scheduleStatus } from '@/utils/schedule'
import { newsType } from '../utils/newsTypes'

interface NewsInfoModalProps {
  item: StoreNews
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
}

/** Yangilik haqida ma'lumot (faqat ko'rish): chapda tafsilotlar, o'ngda yangilikdagi mahsulotlar */
export function NewsInfoModal({ item, open, onOpenChange, onEdit }: NewsInfoModalProps) {
  const { data: all = [], isLoading } = useAllProducts()
  const products = useMemo(() => {
    const ids = new Set(item.products ?? [])
    return all.filter((product) => ids.has(product.id))
  }, [all, item.products])
  const type = newsType(item.news_type)

  return (
    <ContentInfoLayout
      open={open}
      onOpenChange={onOpenChange}
      title={item.title}
      description={item.description}
      image={photoUrl(item.image ?? undefined, 'medium')}
      badges={
        <>
          <ScheduleStatusBadge status={scheduleStatus(item)} />
          <CusBadge color={type.color}>{type.label}</CusBadge>
        </>
      }
      details={[
        { label: 'Muddati', value: formatPeriod(item.starts_at, item.ends_at) },
        { label: 'Slug', value: `/${item.slug}` },
        { label: 'Mahsulotlar', value: `${item.products?.length ?? 0} ta` },
      ]}
      products={products}
      productsLoading={isLoading}
      onEdit={onEdit}
    />
  )
}
