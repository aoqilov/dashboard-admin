import { useState, type ReactNode } from 'react'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDatePicker } from '@/components/ui/calendar/CusDatePicker'
import { CusDrawer } from '@/components/ui/dialog/CusDrawer'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusSegment } from '@/components/ui/segment/CusSegment'
import { CusCombobox } from '@/components/ui/select/CusCombobox'
import { CusLabel } from '@/components/ui/typography/CusTypography'
import { useMaterials, useTags } from '@/features/catalog/api-hooks/useCatalog'
import { SizeChips } from '../components/shared/SizeChips'
import { ADVANCED_KEYS, parseIds, type FilterKey, type ProductFilters } from '../utils/useProductFilters'

interface ProductFilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: ProductFilters
  onApply: (patch: Partial<ProductFilters>) => void
}

type Draft = Partial<Record<FilterKey, string>>

const digits = (value: string) => value.replace(/\D/g, '')

const BLUR_OPTIONS = [
  { value: 'all', label: 'Hammasi' },
  { value: 'no', label: 'Oddiy' },
  { value: 'yes', label: 'Xira' },
]

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <CusLabel>{label}</CusLabel>
      {children}
    </div>
  )
}

/** Kam ishlatiladigan filtrlar — alohida oynada, "Qo'llash" bosilganda URL'ga yoziladi */
export function ProductFilterDrawer({ open, onOpenChange, filters, onApply }: ProductFilterDrawerProps) {
  const { data: tags = [] } = useTags()
  const { data: materials = [] } = useMaterials()
  const [draft, setDraft] = useState<Draft>(() =>
    Object.fromEntries(ADVANCED_KEYS.map((key) => [key, filters[key]])),
  )

  const set = (key: FilterKey, value: string) => setDraft((prev) => ({ ...prev, [key]: value }))

  const rangeInputs = (min: FilterKey, max: FilterKey, placeholders: [string, string]) => (
    <div className="grid grid-cols-2 gap-3">
      <CusInput
        inputMode="numeric"
        placeholder={placeholders[0]}
        value={draft[min] ?? ''}
        onChange={(event) => set(min, digits(event.target.value))}
      />
      <CusInput
        inputMode="numeric"
        placeholder={placeholders[1]}
        value={draft[max] ?? ''}
        onChange={(event) => set(max, digits(event.target.value))}
      />
    </div>
  )

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
              onApply(Object.fromEntries(ADVANCED_KEYS.map((key) => [key, ''])))
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
        <CusCombobox
          label="Teglar"
          multiple
          size="md"
          placeholder="Tanlang"
          emptyText="Teg topilmadi"
          options={tags.map((tag) => ({ label: tag.name, value: String(tag.id) }))}
          value={parseIds(draft.tags ?? '').map(String)}
          onChange={(ids) => set('tags', ids.join(','))}
        />
        <CusCombobox
          label="Materiallar"
          multiple
          size="md"
          placeholder="Tanlang"
          emptyText="Material topilmadi"
          options={materials.map((material) => ({ label: material.name, value: String(material.id) }))}
          value={parseIds(draft.materials ?? '').map(String)}
          onChange={(ids) => set('materials', ids.join(','))}
        />
        <div className="grid grid-cols-2 gap-3">
          <CusInput
            label="Brend"
            placeholder="Zara"
            value={draft.brand ?? ''}
            onChange={(event) => set('brand', event.target.value)}
          />
          <CusInput
            label="Ishlab chiqaruvchi"
            placeholder="Italiya"
            value={draft.manufacture ?? ''}
            onChange={(event) => set('manufacture', event.target.value)}
          />
        </div>
        <Field label="Sotuv narxi, so'm">{rangeInputs('price_min', 'price_max', ['dan', 'gacha'])}</Field>
        <Field label="Ijara narxi, so'm">{rangeInputs('rent_min', 'rent_max', ['dan', 'gacha'])}</Field>
        <Field label="O'lcham">
          <SizeChips value={parseIds(draft.sizes ?? '')} onChange={(sizes) => set('sizes', sizes.join(','))} />
        </Field>
        <Field label="Qo'shilgan sana">
          <div className="grid grid-cols-2 gap-3">
            <CusDatePicker
              size="md"
              placeholder="dan"
              value={draft.date_from ?? ''}
              max={draft.date_to || undefined}
              onChange={(value) => set('date_from', value)}
            />
            <CusDatePicker
              size="md"
              placeholder="gacha"
              value={draft.date_to ?? ''}
              min={draft.date_from || undefined}
              onChange={(value) => set('date_to', value)}
            />
          </div>
        </Field>
        <Field label="Rasmlar">
          <CusSegment
            size="sm"
            items={BLUR_OPTIONS}
            value={draft.blur || 'all'}
            onChange={(value) => set('blur', value === 'all' ? '' : value)}
          />
        </Field>
      </div>
    </CusDrawer>
  )
}
