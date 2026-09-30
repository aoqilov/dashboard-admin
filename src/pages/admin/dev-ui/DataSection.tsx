import { useState } from 'react'
import { CalendarDays, FileText, Home, Package, Settings, ShoppingCart, User } from 'lucide-react'
import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusAccordion } from '@/components/ui/accordion/CusAccordion'
import { CusAlert } from '@/components/ui/alert/CusAlert'
import { CusAvatar } from '@/components/ui/avatar/CusAvatar'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { CusTag } from '@/components/ui/badge/CusTag'
import { CusBreadCrumb } from '@/components/ui/bread-crumb/CusBreadCrumb'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusClipboard } from '@/components/ui/clipboard/CusClipboard'
import { CusDataList } from '@/components/ui/data-list/CusDataList'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'
import { CusProgress, CusProgressCircle } from '@/components/ui/progress/CusProgress'
import { CusSegment } from '@/components/ui/segment/CusSegment'
import { CusSkeleton, CusSkeletonCircle, CusSkeletonText } from '@/components/ui/skeleton/CusSkeleton'
import { CusSpinner } from '@/components/ui/spinner/CusSpinner'
import { CusSteps } from '@/components/ui/steps/CusSteps'
import { CusPagination } from '@/components/ui/table/CusPagination'
import { CusTable, type TableColumn } from '@/components/ui/table/CusTable'
import { CusTabs } from '@/components/ui/tabs/CusTabs'
import { CusTimeline } from '@/components/ui/timeline/CusTimeline'
import { DevRow } from './DevRow'

interface Order {
  id: number
  customer: string
  product: string
  amount: string
  status: 'Delivered' | 'Pending' | 'Canceled'
}

const ORDERS: Order[] = [
  { id: 1, customer: 'Lindsey Curtis', product: 'MacBook Pro 13"', amount: '$2,399', status: 'Delivered' },
  { id: 2, customer: 'Kaiya George', product: 'Apple Watch Ultra', amount: '$879', status: 'Pending' },
  { id: 3, customer: 'Zain Geidt', product: 'iPhone 15 Pro Max', amount: '$1,869', status: 'Delivered' },
  { id: 4, customer: 'Abram Schleifer', product: 'iPad Pro 3rd Gen', amount: '$1,699', status: 'Canceled' },
]

const STATUS_COLORS = { Delivered: 'success', Pending: 'warning', Canceled: 'danger' } as const

const COLUMNS: TableColumn<Order>[] = [
  {
    key: 'customer',
    header: 'Customer',
    render: (row) => (
      <div className="flex items-center gap-3">
        <CusAvatar name={row.customer} size="sm" />
        <span className="font-medium text-heading">{row.customer}</span>
      </div>
    ),
  },
  { key: 'product', header: 'Product' },
  { key: 'amount', header: 'Amount', align: 'end' },
  {
    key: 'status',
    header: 'Status',
    align: 'center',
    render: (row) => <CusBadge color={STATUS_COLORS[row.status]}>{row.status}</CusBadge>,
  },
]

/** Navigatsiya, xabarlar va ma'lumot ko'rsatish */
export function DataSection() {
  const [page, setPage] = useState(1)
  const [tags, setTags] = useState(['Active', 'Admin', 'Uzbekistan'])

  return (
    <>
      <CusCard>
        <CusCardHeader title="Navigation — Chakra" />
        <DevRow title="Breadcrumb">
          <CusBreadCrumb
            items={[
              { label: 'Home', href: '#', icon: <Home className="size-4" /> },
              { label: 'Pages', href: '#' },
              { label: 'User Profile' },
            ]}
          />
        </DevRow>
        <DevRow title="Tabs (line / subtle / enclosed)" className="flex-col items-stretch">
          <CusTabs
            items={[
              { value: 'overview', label: 'Overview', icon: <Home className="size-4" />, content: <p className="text-sm text-muted">Umumiy ma'lumot</p> },
              { value: 'orders', label: 'Orders', icon: <ShoppingCart className="size-4" />, content: <p className="text-sm text-muted">Buyurtmalar</p> },
              { value: 'settings', label: 'Settings', icon: <Settings className="size-4" />, content: <p className="text-sm text-muted">Sozlamalar</p> },
            ]}
          />
          <CusTabs variant="subtle" items={[{ value: 'a', label: 'Monthly' }, { value: 'b', label: 'Quarterly' }, { value: 'c', label: 'Annually' }]} />
          <CusTabs variant="enclosed" items={[{ value: 'a', label: 'Monthly' }, { value: 'b', label: 'Quarterly' }, { value: 'c', label: 'Annually' }]} />
        </DevRow>
        <DevRow title="Segment">
          <CusSegment items={[{ value: 'day', label: 'Kun' }, { value: 'week', label: 'Hafta' }, { value: 'month', label: 'Oy' }]} />
        </DevRow>
        <DevRow title="Steps" className="block">
          <CusSteps
            defaultStep={1}
            items={[
              { title: 'Account', description: 'Ma\'lumotlar' },
              { title: 'Address', description: 'Manzil' },
              { title: 'Payment', description: "To'lov" },
            ]}
          />
        </DevRow>
      </CusCard>

      <CusCard>
        <CusCardHeader title="Table + Pagination — Chakra" />
        <div className="flex flex-col gap-4">
          <CusTable columns={COLUMNS} data={ORDERS} rowKey={(row) => row.id} onRowClick={() => {}} />
          <CusPagination total={97} page={page} onChange={setPage} />
          <CusTable columns={COLUMNS} data={[]} rowKey={(row) => row.id} emptyText="Buyurtmalar yo'q" size="sm" />
        </div>
      </CusCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <CusCard>
          <CusCardHeader title="Feedback — Chakra" />
          <DevRow title="Alert" className="flex-col items-stretch">
            <CusAlert status="success" title="Muvaffaqiyatli" description="Profil yangilandi." onClose={() => {}} />
            <CusAlert status="warning" title="Diqqat" description="Obuna muddati 3 kundan keyin tugaydi." />
            <CusAlert status="error" title="Xatolik" variant="subtle" />
            <CusAlert status="info" title="Yangi versiya chiqdi" variant="solid" />
          </DevRow>
          <DevRow title="Progress" className="flex-col items-stretch">
            <CusProgress value={68} label="Storage" showValue />
            <CusProgress value={40} colorPalette="green" striped />
            <CusProgress value={null} size="xs" />
          </DevRow>
          <DevRow title="ProgressCircle / Spinner">
            <CusProgressCircle value={75} />
            <CusProgressCircle value={40} colorPalette="green" size="md" />
            <CusProgressCircle value={null} size="md" />
            <CusSpinner />
            <CusSpinner size="lg" label="Yuklanmoqda..." />
          </DevRow>
          <DevRow title="Skeleton" className="flex-col items-stretch">
            <div className="flex items-center gap-3">
              <CusSkeletonCircle size="12" />
              <div className="flex flex-1 flex-col gap-2">
                <CusSkeleton height="4" width="40%" />
                <CusSkeleton height="3" width="60%" />
              </div>
            </div>
            <CusSkeletonText lines={3} />
          </DevRow>
        </CusCard>

        <CusCard>
          <CusCardHeader title="Data display — Chakra" />
          <DevRow title="DataList (Profil sahifasidagidek)" className="block">
            <CusDataList
              items={[
                { label: 'First Name', value: 'Musharof' },
                { label: 'Last Name', value: 'Chowdhury' },
                { label: 'Email address', value: 'randomuser@pimjo.com' },
                { label: 'Phone', value: '+09 363 398 46' },
              ]}
            />
          </DevRow>
          <DevRow title="Tag">
            {tags.map((tag) => (
              <CusTag key={tag} onClose={() => setTags((prev) => prev.filter((item) => item !== tag))}>
                {tag}
              </CusTag>
            ))}
            <CusTag colorPalette="brand" icon={<User className="size-3" />} rounded>
              Brand
            </CusTag>
            <CusTag colorPalette="green" variant="solid">
              Solid
            </CusTag>
          </DevRow>
          <DevRow title="Clipboard" className="block">
            <CusClipboard value="sk_live_51HxT8Yq2eZvKYlo2C3..." />
          </DevRow>
          <DevRow title="Timeline" className="block">
            <CusTimeline
              items={[
                { title: 'Buyurtma yaratildi', description: '#1024 — $2,399', time: '09:24', icon: <FileText className="size-3" /> },
                { title: "To'lov qabul qilindi", time: '09:31', icon: <ShoppingCart className="size-3" /> },
                { title: "Jo'natildi", description: 'Toshkent → Samarqand', time: '14:05', icon: <Package className="size-3" /> },
              ]}
            />
          </DevRow>
          <DevRow title="Accordion" className="block">
            <CusAccordion
              defaultValue={['a']}
              items={[
                { value: 'a', title: 'Qanday qilib buyurtma beraman?', content: "Mahsulotni tanlab, savatga qo'shing.", icon: <ShoppingCart className="size-4" /> },
                { value: 'b', title: "To'lov usullari", content: 'Karta, naqd pul va bank o\'tkazmasi.', icon: <CalendarDays className="size-4" /> },
              ]}
            />
          </DevRow>
          <DevRow title="EmptyState" className="block">
            <CusEmptyState
              title="Loyihalar yo'q"
              description="Birinchi loyihangizni yarating"
              action={<CusButton size="sm">Yaratish</CusButton>}
            />
          </DevRow>
        </CusCard>
      </div>
    </>
  )
}
