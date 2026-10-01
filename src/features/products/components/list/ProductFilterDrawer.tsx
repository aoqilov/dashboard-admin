import { useState, type ChangeEvent } from 'react'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDrawer } from '@/components/ui/dialog/CusDrawer'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusLabel } from '@/components/ui/typography/CusTypography'
import type { ProductFilters } from '../../utils/useProductFilters'

interface ProductFilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: ProductFilters
  onApply: (patch: Partial<ProductFilters>) => void
}

const digits = (value: string) => value.replace(/\D/g, '')

/** Narx va o'lcham oralig'i — kam ishlatiladi, shuning uchun alohida oynada */
export function ProductFilterDrawer({ open, onOpenChange, filters, onApply }: ProductFilterDrawerProps) {
  const [draft, setDraft] = useState({
    price_min: filters.price_min,
    price_max: filters.price_max,
    size_min: filters.size_min,
    size_max: filters.size_max,
  })

  const set = (key: keyof typeof draft) => (event: ChangeEvent<HTMLInputElement>) =>
    setDraft((prev) => ({ ...prev, [key]: digits(event.target.value) }))

  return (
    <CusDrawer
      open={open}
      onOpenChange={onOpenChange}
      placement="end"
      size="sm"
      title="Filtrlar"
      footer={
        <div className="flex w-full gap-3">
          <CusButton
            variant="outline"
            fullWidth
            onClick={() => {
              onApply({ price_min: '', price_max: '', size_min: '', size_max: '' })
              onOpenChange(false)
            }}
          >
            Tozalash
          </CusButton>
          <CusButton
            fullWidth
            onClick={() => {
              onApply(draft)
              onOpenChange(false)
            }}
          >
            Qo'llash
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <CusLabel>Sotuv narxi, so'm</CusLabel>
          <div className="grid grid-cols-2 gap-3">
            <CusInput inputMode="numeric" placeholder="dan" value={draft.price_min} onChange={set('price_min')} />
            <CusInput inputMode="numeric" placeholder="gacha" value={draft.price_max} onChange={set('price_max')} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <CusLabel>O'lcham</CusLabel>
          <div className="grid grid-cols-2 gap-3">
            <CusInput inputMode="numeric" placeholder="dan (40)" value={draft.size_min} onChange={set('size_min')} />
            <CusInput inputMode="numeric" placeholder="gacha (46)" value={draft.size_max} onChange={set('size_max')} />
          </div>
        </div>
      </div>
    </CusDrawer>
  )
}
