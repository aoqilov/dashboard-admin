import { useState } from 'react'
import { Pencil, Store } from 'lucide-react'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDataList } from '@/components/ui/data-list/CusDataList'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'
import { CusSpinner } from '@/components/ui/spinner/CusSpinner'
import { formatDate } from '@/utils/format'
import { displayUzPhone } from '@/utils/phone'
import { useStoreInfo } from '../api-hooks/useStore'
import { StoreInfoModal } from '../modals/StoreInfoModal'

/** Do'konning asosiy ma'lumotlari — bitta yozuv, shuning uchun jadval emas */
export function StoreInfoTab() {
  const { data: store, isLoading, isError, refetch } = useStoreInfo()
  const [editing, setEditing] = useState(false)

  if (isLoading) return <CusSpinner fullArea />
  if (isError || !store) {
    return (
      <CusEmptyState
        icon={<Store />}
        title="Do'kon ma'lumotlari yuklanmadi"
        action={
          <CusButton size="sm" variant="outline" onClick={() => refetch()}>
            Qayta urinish
          </CusButton>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-semibold text-heading">{store.name}</h3>
          <CusBadge color={store.active === false ? 'danger' : 'success'} className="self-start">
            {store.active === false ? 'Nofaol' : 'Faol'}
          </CusBadge>
        </div>
        <CusButton size="sm" variant="outline" leftIcon={<Pencil />} onClick={() => setEditing(true)}>
          Tahrirlash
        </CusButton>
      </div>

      <CusDataList
        columns={4}
        items={[
          { label: 'Telefon', value: displayUzPhone(store.phone) || '—' },
          { label: 'Email', value: store.email || '—' },
          { label: 'Yaratilgan', value: formatDate(store.created_at) },
          { label: 'Yangilangan', value: formatDate(store.updated_at) },
        ]}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted">Tavsif</span>
        <p className="text-sm whitespace-pre-line text-content">{store.description || '—'}</p>
      </div>

      {editing && <StoreInfoModal store={store} open onOpenChange={setEditing} />}
    </div>
  )
}
