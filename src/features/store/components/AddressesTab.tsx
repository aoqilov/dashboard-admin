import type { StoreAddress } from '@/api/routes/stores-addresses/storeAddresses.types'
import type { TableColumn } from '@/components/ui/table/CusTable'
import { displayUzPhone } from '@/utils/phone'
import { useAddresses, useAddressMutations } from '../api-hooks/useStore'
import { AddressModal } from '../modals/AddressModal'
import { CrudSection } from './CrudSection'

const columns: TableColumn<StoreAddress>[] = [
  {
    key: 'name',
    header: 'Nomi',
    render: (row) => <span className="text-sm font-medium text-heading">{row.name}</span>,
  },
  {
    key: 'address',
    header: 'Manzil',
    render: (row) => (
      <div className="flex max-w-sm flex-col gap-0.5">
        <span className="text-sm text-content">{row.address}</span>
        {row.landmark && <span className="text-xs text-muted">Mo'ljal: {row.landmark}</span>}
      </div>
    ),
  },
  {
    key: 'working_hours',
    header: 'Ish vaqti',
    render: (row) => <span className="text-sm text-content">{row.working_hours || '—'}</span>,
  },
  {
    key: 'phone',
    header: 'Telefon',
    render: (row) => <span className="text-sm whitespace-nowrap text-content">{displayUzPhone(row.phone) || '—'}</span>,
  },
]

/** Filiallar manzillari */
export function AddressesTab() {
  const { data = [], isLoading } = useAddresses()
  const { remove } = useAddressMutations()

  return (
    <CrudSection
      noun="Manzil"
      columns={columns}
      data={data}
      isLoading={isLoading}
      getName={(row) => row.name}
      remove={remove}
      renderModal={(props) => <AddressModal {...props} />}
    />
  )
}
