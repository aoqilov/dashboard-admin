import type { StoreService } from '@/api/routes/stores-services/storeServices.types'
import type { TableColumn } from '@/components/ui/table/CusTable'
import { useIcons, useServiceMutations, useServices } from '../api-hooks/useStore'
import { ServiceModal } from '../modals/ServiceModal'
import { CrudSection } from './CrudSection'
import { VisibleSwitch } from './VisibleSwitch'

/** Do'kon xizmatlari (tikish, yetkazib berish ...) */
export function ServicesTab() {
  const { data = [], isLoading } = useServices()
  const { data: icons = [] } = useIcons()
  const { update, remove } = useServiceMutations()

  const columns: TableColumn<StoreService>[] = [
    {
      key: 'title',
      header: 'Sarlavha',
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          {row.kicker && <span className="text-xs text-muted">{row.kicker}</span>}
          <span className="text-sm font-medium text-heading">{row.title}</span>
        </div>
      ),
    },
    {
      key: 'icon',
      header: 'Ikonka',
      render: (row) => (
        <code className="rounded bg-hover px-1.5 py-0.5 text-xs text-content">
          {icons.find((icon) => icon.id === row.icon)?.name ?? `#${row.icon}`}
        </code>
      ),
    },
    {
      key: 'description',
      header: 'Tavsif',
      render: (row) => <p className="line-clamp-2 max-w-sm text-sm text-content">{row.description || '—'}</p>,
    },
    {
      key: 'visible',
      header: "Ko'rinadi",
      width: '96px',
      render: (row) => <VisibleSwitch id={row.id} visible={row.visible} update={update} />,
    },
  ]

  return (
    <CrudSection
      noun="Xizmat"
      columns={columns}
      data={data}
      isLoading={isLoading}
      getName={(row) => row.title}
      remove={remove}
      renderModal={(props) => <ServiceModal {...props} />}
    />
  )
}
