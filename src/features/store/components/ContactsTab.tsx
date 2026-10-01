import type { StoreContact } from '@/api/routes/stores-contacts/storeContacts.types'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import type { TableColumn } from '@/components/ui/table/CusTable'
import { displayUzPhone } from '@/utils/phone'
import { useContactMutations, useContacts } from '../api-hooks/useStore'
import { ContactModal } from '../modals/ContactModal'
import { CrudSection } from './CrudSection'

const columns: TableColumn<StoreContact>[] = [
  {
    key: 'name',
    header: 'Ism',
    render: (row) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-heading">{row.name}</span>
        {row.role && <span className="text-xs text-muted">{row.role}</span>}
      </div>
    ),
  },
  {
    key: 'phone',
    header: 'Telefon',
    render: (row) => <span className="text-sm whitespace-nowrap text-content">{displayUzPhone(row.phone) || '—'}</span>,
  },
  {
    key: 'telegram',
    header: 'Telegram',
    render: (row) => (
      <span className="flex items-center gap-2 text-sm text-content">
        {row.telegram || '—'}
        {row.has_telegram && <CusBadge color="info">Yozish mumkin</CusBadge>}
      </span>
    ),
  },
  {
    key: 'hours',
    header: 'Ish vaqti',
    render: (row) => <span className="text-sm text-content">{row.hours || '—'}</span>,
  },
]

/** Aloqa uchun shaxslar (xodimlar) */
export function ContactsTab() {
  const { data = [], isLoading } = useContacts()
  const { remove } = useContactMutations()

  return (
    <CrudSection
      noun="Kontakt"
      columns={columns}
      data={data}
      isLoading={isLoading}
      getName={(row) => row.name}
      remove={remove}
      renderModal={(props) => <ContactModal {...props} />}
    />
  )
}
