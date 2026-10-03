import { useEffect, useMemo, useState } from 'react'
import type { ContentStatus } from '@/api/common.types'
import type { StoreNews } from '@/api/routes/stores-news/storeNews.types'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { ScheduleStatusBadge } from '@/components/shared/status/ScheduleStatusBadge'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { LayoutSwitch } from '@/components/shared/layout-switch/LayoutSwitch'
import { CusSegment } from '@/components/ui/segment/CusSegment'
import type { TableColumn } from '@/components/ui/table/CusTable'
import { ProductImage } from '@/features/products/components/shared/ProductBits'
import { CrudSection } from '@/features/store/components/CrudSection'
import { CONTENT_LAYOUT_OPTIONS, useContentLayout } from '@/features/store/utils/contentLayout'
import { photoUrl } from '@/utils/media'
import { formatPeriod, scheduleStatus, sortBySchedule } from '@/utils/schedule'
import { useNewsList, useNewsMutations } from './api-hooks/useNews'
import { NewsModal } from './modals/NewsModal'
import { clearNewsDraft, finishNewsPicking, useNewsDraft } from './utils/newsDraft'
import { newsType } from './utils/newsTypes'

type Row = StoreNews & { phase: ContentStatus }

const COLUMNS: TableColumn<Row>[] = [
  {
    key: 'title',
    header: 'Yangilik',
    render: (row) => (
      <div className="flex min-w-55 items-center gap-3">
        <ProductImage src={photoUrl(row.image ?? undefined, 'small')} className="size-11 rounded-control" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-heading">{row.title}</p>
          <p className="truncate text-xs text-subtle">/{row.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'type',
    header: 'Turi',
    render: (row) => <CusBadge color={newsType(row.news_type).color}>{newsType(row.news_type).label}</CusBadge>,
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
    render: (row) => <span className="text-sm text-muted">{row.products?.length ?? 0} ta</span>,
  },
]

/** Yangiliklar: muddatga qarab navbat — kutmoqda → faol → arxiv */
export default function FeatureNews() {
  const { data = [], isLoading } = useNewsList()
  const { remove } = useNewsMutations()
  const [filter, setFilter] = useState('all')
  const [layout, setLayout] = useContentLayout('news-layout')
  const { draft, picking } = useNewsDraft()

  // Mahsulot tanlash rejimidan qaytilganda (yoki sidebar orqali kelinganda) rejim o'chadi, forma qayta ochiladi
  useEffect(() => finishNewsPicking(), [])

  const rows = useMemo<Row[]>(
    () => sortBySchedule(data.map((item) => ({ ...item, phase: scheduleStatus(item) }))),
    [data],
  )
  const count = (phase: ContentStatus) => rows.filter((row) => row.phase === phase).length
  const visible = filter === 'all' ? rows : rows.filter((row) => row.phase === filter)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="News" description="Yangiliklar: muddati kelganda faol bo'ladi, o'tgach arxivga tushadi" />
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
          noun="Yangilik"
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
            badges: (
              <>
                <ScheduleStatusBadge status={row.phase} />
                <CusBadge color={newsType(row.news_type).color}>{newsType(row.news_type).label}</CusBadge>
              </>
            ),
            meta: (
              <>
                <span>{formatPeriod(row.starts_at, row.ends_at)}</span>
                <span>{row.products?.length ?? 0} ta mahsulot</span>
              </>
            ),
          })}
          deleteDescription="Yangilik saytdan ham olib tashlanadi. Bu amalni ortga qaytarib bo'lmaydi."
          renderModal={(props) => <NewsModal {...props} />}
        />
      </CusCard>

      {/* Mahsulot tanlab qaytilganda: saqlab qo'yilgan forma */}
      {draft && !picking && !isLoading && (
        <NewsModal
          item={data.find((news) => news.id === draft.itemId) ?? null}
          draft={draft}
          open
          onOpenChange={(open) => !open && clearNewsDraft()}
        />
      )}
    </div>
  )
}
