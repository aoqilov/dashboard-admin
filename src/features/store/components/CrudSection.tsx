import { useState, type ComponentProps, type ReactNode } from 'react'
import { Ellipsis, Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/api/api-config/apiError'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { CusDialogDelete } from '@/components/ui/dialog/CusDialogDelete'
import { CusMenu } from '@/components/ui/menu/CusMenu'
import { CusTable, type TableColumn } from '@/components/ui/table/CusTable'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { toaster } from '@/components/ui/toaster/toaster'
import type { ContentLayout } from '../utils/contentLayout'
import { ContentCard } from './ContentCard'

/** CrudSection ochadigan modal props'lari. item = null — yangi element */
export interface CrudModalProps<T> {
  item: T | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface CrudSectionProps<T extends { id: number }> {
  /** Birlik nomi: "Manzil" — tugma va bo'sh holat matnlarida */
  noun: string
  /** Amallar (⋯) ustuni o'zi qo'shiladi */
  columns: TableColumn<T>[]
  data: T[]
  isLoading?: boolean
  emptyText?: string
  /** O'chirish oynasi va toast'da ko'rinadigan nom */
  getName: (row: T) => string
  remove: { mutateAsync: (id: number) => Promise<unknown>; isPending: boolean }
  deleteDescription?: string
  /** Qo'shish tugmasi oldidagi element (ko'rinish almashtirgich) */
  toolbar?: ReactNode
  /** Jadvaldan boshqa ko'rinish; renderCard bo'lsa kartalar chiziladi */
  layout?: ContentLayout
  /** Karta mazmuni — menu (⋯) tayyor beriladi */
  renderCard?: (row: T) => Omit<ComponentProps<typeof ContentCard>, 'layout' | 'menu' | 'onClick'>
  /** Ma'lumot (faqat ko'rish) modali. Berilsa — qator/karta bosilganda shu ochiladi, tahrirlash menyudan */
  renderView?: (props: CrudModalProps<T> & { item: T; onEdit: () => void }) => ReactNode
  /** Yaratish/tahrirlash modali — modals/ papkasidan */
  renderModal: (props: CrudModalProps<T>) => ReactNode
}

/** Jadval + qo'shish/tahrirlash modali + o'chirishni tasdiqlash. Magazin tablari shu ustiga quriladi */
export function CrudSection<T extends { id: number }>({
  noun,
  columns,
  data,
  isLoading,
  emptyText,
  getName,
  remove,
  deleteDescription,
  toolbar,
  layout = 'table',
  renderCard,
  renderView,
  renderModal,
}: CrudSectionProps<T>) {
  const [modal, setModal] = useState<{ item: T | null } | null>(null)
  const [viewing, setViewing] = useState<T | null>(null)
  const [toDelete, setToDelete] = useState<T | null>(null)

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await remove.mutateAsync(toDelete.id)
      toaster.create({ type: 'success', title: `"${getName(toDelete)}" o'chirildi` })
      setToDelete(null)
    } catch (err) {
      toaster.create({ type: 'error', title: getErrorMessage(err) })
    }
  }

  const openRow = (row: T) => (renderView ? setViewing(row) : setModal({ item: row }))

  const rowMenu = (row: T) => (
    <CusMenu
      trigger={<CusIconButton icon={Ellipsis} label="Amallar" size="sm" />}
      items={[
        ...(renderView ? [{ value: 'view', label: "Ko'rish", icon: <Eye className="size-4" /> }] : []),
        { value: 'edit', label: 'Tahrirlash', icon: <Pencil className="size-4" /> },
        { value: 'delete', label: "O'chirish", icon: <Trash2 className="size-4" />, isDanger: true },
      ]}
      onSelect={(value) =>
        value === 'view' ? setViewing(row) : value === 'edit' ? setModal({ item: row }) : setToDelete(row)
      }
    />
  )

  const actionsColumn: TableColumn<T> = {
    key: 'actions',
    header: '',
    align: 'end',
    width: '56px',
    render: (row) => <div onClick={(event) => event.stopPropagation()}>{rowMenu(row)}</div>,
  }

  const empty = emptyText ?? `Hali ${noun.toLowerCase()} qo'shilmagan`
  const asCards = layout !== 'table' && renderCard

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{data.length} ta</p>
        <div className="flex items-center gap-2">
          {toolbar}
          <CusButton size="sm" leftIcon={<Plus />} onClick={() => setModal({ item: null })}>
            {noun} qo'shish
          </CusButton>
        </div>
      </div>

      {asCards ? (
        isLoading ? (
          <CusSkeleton height="240px" />
        ) : data.length === 0 ? (
          <CusEmptyState size="sm" title={empty} />
        ) : (
          <div className={layout === 'grid' ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-3'}>
            {data.map((row) => (
              <ContentCard
                key={row.id}
                layout={layout as 'grid' | 'list'}
                {...renderCard(row)}
                menu={rowMenu(row)}
                onClick={() => openRow(row)}
              />
            ))}
          </div>
        )
      ) : (
        <CusTable
          columns={[...columns, actionsColumn]}
          data={data}
          rowKey={(row) => row.id}
          onRowClick={openRow}
          isLoading={isLoading}
          emptyText={empty}
        />
      )}

      {viewing &&
        renderView?.({
          item: viewing,
          open: true,
          onOpenChange: (open) => !open && setViewing(null),
          onEdit: () => {
            setModal({ item: viewing })
            setViewing(null)
          },
        })}

      {/* Har ochilganda qaytadan mount — forma toza holatdan boshlanadi */}
      {modal && renderModal({ item: modal.item, open: true, onOpenChange: (open) => !open && setModal(null) })}

      <CusDialogDelete
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`"${toDelete ? getName(toDelete) : ''}" o'chirilsinmi?`}
        description={deleteDescription}
        onConfirm={handleDelete}
        isLoading={remove.isPending}
      />
    </div>
  )
}
