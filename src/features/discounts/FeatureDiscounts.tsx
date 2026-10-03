import { useEffect, useMemo, useState } from 'react'
import type { ContentStatus } from '@/api/common.types'
import type { StoreDiscount } from '@/api/routes/stores-discounts/storeDiscounts.types'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { ScheduleStatusBadge } from '@/components/shared/status/ScheduleStatusBadge'
import { LayoutSwitch } from '@/components/shared/layout-switch/LayoutSwitch'
import { CusSegment } from '@/components/ui/segment/CusSegment'
import type { TableColumn } from '@/components/ui/table/CusTable'
import { ProductImage } from '@/features/products/components/shared/ProductBits'
import { CrudSection } from '@/features/store/components/CrudSection'
import { CONTENT_LAYOUT_OPTIONS, useContentLayout } from '@/features/store/utils/contentLayout'
import { photoUrl } from '@/utils/media'
import { formatPeriod, scheduleStatus, sortBySchedule } from '@/utils/schedule'
import { useDiscountList, useDiscountMutations } from './api-hooks/useDiscounts'
import { DiscountModal } from './modals/DiscountModal'
import { clearDraft, finishPicking, useDiscountDraft } from './utils/discountDraft'
import { formatRule } from './utils/discountPrice'

type Row = StoreDiscount & { phase: ContentStatus }

/** "5 ta · 10–25%" yoki "2 ta · 20 000 so'm" */
function productsSummary(row: StoreDiscount) {
  const items = row.products ?? []
  if (!items.length) return '—'
  const percents = items.filter((item) => item.discount_type === 'percentage').map((item) => Number(item.value))
  const parts = [`${items.length} ta`]
  if (percents.length) {
    const min = Math.min(...percents)
    const max = Math.max(...percents)
    parts.push(min === max ? formatRule({ type: 'percentage', value: min }) : `${min}–${max}%`)
  }
  return parts.join(' · ')
}

const COLUMNS: TableColumn<Row>[] = [
  {
    key: 'title',
    header: 'Chegirma',
    render: (row) => (
      <div className="flex min-w-55 items-center gap-3">
        <ProductImage src={photoUrl(row.image ?? undefined, 'small')} className="size-11 rounded-control" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-heading">{row.title}</p>
          {row.description && <p className="line-clamp-1 max-w-md text-xs text-subtle">{row.description}</p>}
        </div>
      </div>
    ),
  },
  {
    key: 'period',
    header: 'Muddati',
    render: (row) => <span className="text-sm text-content">{formatPeriod(row.starts_at, row.ends_at)}</span>,
  },
  { key: 'status', header: 'Holati', render: (row) => <ScheduleStatusBadge status={row.phase} /> },
  {
    key: 'products',
    header: 'Mahsulotlar',
    render: (row) => <span className="text-sm text-muted">{productsSummary(row)}</span>,
  },
]

/** Chegirmalar: muddatga qarab navbat — kutmoqda → faol → arxiv. Faol chegirma mahsulot narxida ko'rinadi */
export default function FeatureDiscounts() {
  const { data = [], isLoading } = useDiscountList()
  const { remove } = useDiscountMutations()
  const [filter, setFilter] = useState('all')
  const [layout, setLayout] = useContentLayout('discounts-layout')
  const { draft, picking } = useDiscountDraft()

  // Mahsulot tanlash rejimidan qaytilganda (yoki sidebar orqali kelinganda) rejim o'chadi, forma qayta ochiladi
  useEffect(() => finishPicking(), [])

  const rows = useMemo<Row[]>(
    () => sortBySchedule(data.map((item) => ({ ...item, phase: scheduleStatus(item) }))),
    [data],
  )
  const count = (phase: ContentStatus) => rows.filter((row) => row.phase === phase).length
  const visible = filter === 'all' ? rows : rows.filter((row) => row.phase === filter)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Скидки"
        description="Chegirmalar: muddati kelganda faol bo'ladi, mahsulot narxida eski narx chizilib ko'rinadi"
      />
      <CusCard className="flex flex-col gap-4">
        <CusSegment
          size="sm"
          value={filter}
          onChange={setFilter}
          items={[
            { value: 'all', label: `Hammasi · ${rows.length}` },
            { value: 'active', label: `Faol · ${count('active')}` },
            { value: 'draft', label: `Navbatda · ${count('draft')}` },
            { value: 'archived', label: `Arxiv · ${count('archived')}` },
          ]}
        />
        <CrudSection
          noun="Chegirma"
          columns={COLUMNS}
          data={visible}
          isLoading={isLoading}
          getName={(row) => row.title}
          remove={remove}
          layout={layout}
          toolbar={<LayoutSwitch options={CONTENT_LAYOUT_OPTIONS} value={layout} onChange={setLayout} />}
          renderCard={(row) => ({
            image: photoUrl(row.image ?? undefined, 'medium'),
            title: row.title,
            description: row.description,
            badges: <ScheduleStatusBadge status={row.phase} />,
            meta: (
              <>
                <span>{formatPeriod(row.starts_at, row.ends_at)}</span>
                <span>{productsSummary(row)}</span>
              </>
            ),
          })}
          deleteDescription="Chegirma o'chiriladi, mahsulotlar eski narxga qaytadi. Bu amalni ortga qaytarib bo'lmaydi."
          renderModal={(props) => <DiscountModal {...props} />}
        />
      </CusCard>

      {/* Mahsulot tanlab qaytilganda: saqlab qo'yilgan forma */}
      {draft && !picking && !isLoading && (
        <DiscountModal
          item={data.find((discount) => discount.id === draft.itemId) ?? null}
          draft={draft}
          open
          onOpenChange={(open) => !open && clearDraft()}
        />
      )}
    </div>
  )
}
