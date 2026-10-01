import { useState, type FormEvent } from 'react'
import { getErrorMessage } from '@/api/api-config/apiError'
import type { StoreCategory } from '@/api/routes/stores-categories/storeCategories.types'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDialog } from '@/components/ui/dialog/CusDialog'
import { CusFileUpload } from '@/components/ui/inputs/CusFileUpload'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusLabel } from '@/components/ui/typography/CusTypography'
import { toaster } from '@/components/ui/toaster/toaster'
import { useCategoryMutations } from '../api-hooks/useCategories'
import { CategoryThumb } from '../components/CategoryThumb'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Berilsa — tahrirlash */
  category?: StoreCategory | null
  /** Yangi subkategoriya uchun ota kategoriya */
  parent?: StoreCategory | null
}

/** Kategoriya / subkategoriya qo'shish va tahrirlash */
export function CategoryDialog({ open, onOpenChange, category, parent }: CategoryDialogProps) {
  const { create, update } = useCategoryMutations()
  const [name, setName] = useState(category?.name ?? '')
  const [cover, setCover] = useState<File | null>(null)
  const [error, setError] = useState<string>()

  const isEdit = Boolean(category)
  const isSub = isEdit ? category!.parent != null : Boolean(parent)
  const isSaving = create.isPending || update.isPending
  const noun = isSub ? 'Subkategoriya' : 'Kategoriya'

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return setError('Nomini kiriting')

    // Rasm bo'lsa — FormData, aks holda JSON
    let body: FormData | { name: string; parent?: number | null }
    if (cover) {
      body = new FormData()
      body.append('name', name.trim())
      if (!isEdit && parent) body.append('parent', String(parent.id))
      body.append('cover', cover)
    } else {
      body = isEdit ? { name: name.trim() } : { name: name.trim(), parent: parent?.id ?? null }
    }

    try {
      if (isEdit) await update.mutateAsync({ id: category!.id, body })
      else await create.mutateAsync(body)
      toaster.create({ type: 'success', title: isEdit ? 'Saqlandi' : `${noun} qo'shildi` })
      onOpenChange(false)
    } catch (err) {
      toaster.create({ type: 'error', title: getErrorMessage(err) })
    }
  }

  return (
    <CusDialog
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={isEdit ? `${noun}ni tahrirlash` : `Yangi ${noun.toLowerCase()}`}
      description={parent && !isEdit ? `${parent.name} ichida` : undefined}
      footer={
        <>
          <CusButton variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </CusButton>
          <CusButton type="submit" form="category-form" isLoading={isSaving}>
            Saqlash
          </CusButton>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        <CusInput
          label="Nomi"
          autoFocus
          value={name}
          error={error}
          onChange={(event) => {
            setName(event.target.value)
            setError(undefined)
          }}
          placeholder={isSub ? 'Kechki ko\'ylaklar' : "Ko'ylaklar"}
        />
        <div className="flex flex-col gap-2">
          <CusLabel>Muqova rasmi (ixtiyoriy)</CusLabel>
          {category && !cover && (category.cover || category.cover_processed) && (
            <div className="flex items-center gap-3">
              <CategoryThumb category={category} className="size-14" />
              <span className="text-xs text-muted">Yangisini yuklasangiz almashtiriladi</span>
            </div>
          )}
          <CusFileUpload
            maxFiles={1}
            accept={['image/*']}
            onChange={(files) => setCover(files[0] ?? null)}
            title="Rasmni shu yerga tashlang"
            description="PNG, JPG yoki WEBP"
          />
        </div>
      </form>
    </CusDialog>
  )
}
