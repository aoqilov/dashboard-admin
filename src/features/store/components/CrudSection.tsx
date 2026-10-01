import { useState, type ReactNode } from 'react'
import { Ellipsis, Pencil, Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/api/api-config/apiError'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { CusDialogDelete } from '@/components/ui/dialog/CusDialogDelete'
import { CusMenu } from '@/components/ui/menu/CusMenu'
import { CusTable, type TableColumn } from '@/components/ui/table/CusTable'
import { toaster } from '@/components/ui/toaster/toaster'

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
  renderModal,
}: CrudSectionProps<T>) {
  const [modal, setModal] = useState<{ item: T | null } | null>(null)
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

  const actionsColumn: TableColumn<T> = {
    key: 'actions',
    header: '',
    align: 'end',
    width: '56px',
    render: (row) => (
      <div onClick={(event) => event.stopPropagation()}>
        <CusMenu
          trigger={<CusIconButton icon={Ellipsis} label="Amallar" size="sm" />}
          items={[
            { value: 'edit', label: 'Tahrirlash', icon: <Pencil className="size-4" /> },
            { value: 'delete', label: "O'chirish", icon: <Trash2 className="size-4" />, isDanger: true },
          ]}
          onSelect={(value) => (value === 'edit' ? setModal({ item: row }) : setToDelete(row))}
        />
      </div>
    ),
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{data.length} ta</p>
        <CusButton size="sm" leftIcon={<Plus />} onClick={() => setModal({ item: null })}>
          {noun} qo'shish
        </CusButton>
      </div>

      <CusTable
        columns={[...columns, actionsColumn]}
        data={data}
        rowKey={(row) => row.id}
        onRowClick={(row) => setModal({ item: row })}
        isLoading={isLoading}
        emptyText={emptyText ?? `Hali ${noun.toLowerCase()} qo'shilmagan`}
      />

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
