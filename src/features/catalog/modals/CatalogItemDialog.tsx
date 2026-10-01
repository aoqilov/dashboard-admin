import { useState, type FormEvent } from 'react'
import { getErrorMessage } from '@/api/api-config/apiError'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDialog } from '@/components/ui/dialog/CusDialog'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusSelect } from '@/components/ui/select/CusSelect'
import { toaster } from '@/components/ui/toaster/toaster'
import {
  useColorMutations,
  useMaterialCategories,
  useMaterialCategoryMutations,
  useMaterialMutations,
  useTagMutations,
} from '../api-hooks/useCatalog'
import { CATALOG_NOUN, type CatalogItem, type CatalogKind } from '../utils/catalogKinds'

const PLACEHOLDER: Record<CatalogKind, string> = {
  color: 'Qora',
  tag: 'Yangi kolleksiya',
  material: 'Ipak',
  materialCategory: 'Mato',
}

interface CatalogItemDialogProps {
  kind: CatalogKind
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Berilsa — tahrirlash */
  item?: CatalogItem | null
  /** Yangi element yaratilgandan keyin (masalan formada darhol tanlash uchun) */
  onCreated?: (item: CatalogItem) => void
  /** Material uchun oldindan tanlangan guruh */
  defaultCategory?: number | null
}

/** Rang / teg / material / material guruhi qo'shish va tahrirlash */
export function CatalogItemDialog({
  kind,
  open,
  onOpenChange,
  item,
  onCreated,
  defaultCategory,
}: CatalogItemDialogProps) {
  const mutations = {
    color: useColorMutations(),
    tag: useTagMutations(),
    material: useMaterialMutations(),
    materialCategory: useMaterialCategoryMutations(),
  }[kind]
  const { data: materialCategories = [] } = useMaterialCategories()

  const [name, setName] = useState(item?.name ?? '')
  const [hex, setHex] = useState(item?.hex_code ?? '#000000')
  const [category, setCategory] = useState(item?.category ?? defaultCategory ?? null)
  const [error, setError] = useState<string>()

  const isEdit = Boolean(item)
  const noun = CATALOG_NOUN[kind]
  const isSaving = mutations.create.isPending || mutations.update.isPending

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return setError('Nomini kiriting')

    const body = {
      name: name.trim(),
      ...(kind === 'color' && { hex_code: hex }),
      ...(kind === 'material' && { category }),
    }

    try {
      if (isEdit) {
        await mutations.update.mutateAsync({ id: item!.id, body: body as never })
        toaster.create({ type: 'success', title: 'Saqlandi' })
      } else {
        const created = await mutations.create.mutateAsync(body as never)
        toaster.create({ type: 'success', title: `${noun} qo'shildi` })
        onCreated?.(created as CatalogItem)
      }
      onOpenChange(false)
    } catch (err) {
      toaster.create({ type: 'error', title: getErrorMessage(err) })
    }
  }

  return (
    <CusDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xs"
      title={isEdit ? `${noun}ni tahrirlash` : `Yangi ${noun.toLowerCase()}`}
      footer={
        <>
          <CusButton variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </CusButton>
          <CusButton type="submit" form={`catalog-${kind}-form`} isLoading={isSaving}>
            Saqlash
          </CusButton>
        </>
      }
    >
      <form id={`catalog-${kind}-form`} onSubmit={handleSubmit} className="flex flex-col gap-5">
        <CusInput
          label="Nomi"
          autoFocus
          value={name}
          error={error}
          placeholder={PLACEHOLDER[kind]}
          onChange={(event) => {
            setName(event.target.value)
            setError(undefined)
          }}
        />

        {kind === 'color' && (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-content">Rang kodi</span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(event) => setHex(event.target.value)}
                className="size-10 shrink-0 cursor-pointer rounded-control border border-border-strong bg-transparent p-1"
                aria-label="Rangni tanlash"
              />
              <CusInput
                className="flex-1"
                value={hex}
                maxLength={7}
                onChange={(event) => setHex(event.target.value)}
              />
            </div>
          </div>
        )}

        {kind === 'material' && (
          <CusSelect
            label="Guruh"
            placeholder="Guruhsiz"
            size="md"
            clearable
            options={materialCategories.map((c) => ({ label: c.name, value: String(c.id) }))}
            value={category ? [String(category)] : []}
            onChange={([value]) => setCategory(value ? Number(value) : null)}
          />
        )}
      </form>
    </CusDialog>
  )
}
