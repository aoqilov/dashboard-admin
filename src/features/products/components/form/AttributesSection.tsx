import { useState } from 'react'
import { Ban, Check, Plus } from 'lucide-react'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusTooltip } from '@/components/ui/tooltip/CusTooltip'
import { useColors, useMaterialCategories, useMaterials } from '@/features/catalog/api-hooks/useCatalog'
import { CatalogItemDialog } from '@/features/catalog/modals/CatalogItemDialog'
import type { CatalogKind } from '@/features/catalog/utils/catalogKinds'
import { cn } from '@/utils/cn'
import type { SectionProps } from '../../utils/productForm'
import { SizeChips } from '../shared/SizeChips'
import { FormSection } from './FormSection'

/** Oq/och ranglar ustida belgi qora bo'lsin */
function isLight(hex: string) {
  const value = hex.replace('#', '')
  if (value.length !== 6) return false
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16))
  return r * 0.299 + g * 0.587 + b * 0.114 > 186
}

export function AttributesSection({ values, errors, set }: SectionProps) {
  const { data: colors = [] } = useColors()
  const { data: materials = [] } = useMaterials()
  const { data: materialCategories = [] } = useMaterialCategories()
  const [dialog, setDialog] = useState<CatalogKind | null>(null)

  // Materiallar guruhlari bo'yicha: Mato [ipak, paxta], Bezak [tosh] ...
  const groups = [
    ...materialCategories.map((group) => ({
      name: group.name,
      items: materials.filter((material) => material.category === group.id),
    })),
    { name: 'Boshqa', items: materials.filter((material) => material.category == null) },
  ].filter((group) => group.items.length > 0)

  const toggleMaterial = (id: number) =>
    set(
      'material_ids',
      values.material_ids.includes(id)
        ? values.material_ids.filter((item) => item !== id)
        : [...values.material_ids, id],
    )

  const addLink = (kind: CatalogKind, label: string) => (
    <button
      type="button"
      onClick={() => setDialog(kind)}
      className="flex items-center gap-1 text-xs font-medium text-primary hover:underline dark:text-primary-light"
    >
      <Plus className="size-3.5" /> {label}
    </button>
  )

  const selectedColor = colors.find((color) => String(color.id) === values.color)

  return (
    <FormSection title="Xususiyatlar">
      <div className="grid gap-5 sm:grid-cols-2">
        <CusInput
          label="Brend"
          placeholder="Zara"
          value={values.brand}
          onChange={(event) => set('brand', event.target.value)}
        />
        <CusInput
          label="Ishlab chiqaruvchi"
          placeholder="Italiya"
          value={values.manufacture}
          onChange={(event) => set('manufacture', event.target.value)}
        />
      </div>

      {/* Rang: doirachalar */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-content">
            Rang{selectedColor && <span className="font-normal text-muted"> · {selectedColor.name}</span>}
          </span>
          {addLink('color', 'Yangi rang')}
        </div>
        <div className="flex flex-wrap gap-2.5">
          <CusTooltip content="Rangsiz">
            <button
              type="button"
              aria-label="Rangsiz"
              aria-pressed={!values.color}
              onClick={() => set('color', '')}
              className={cn(
                'flex size-8 items-center justify-center rounded-full border border-border-strong text-subtle transition-shadow',
                !values.color && 'ring-2 ring-primary ring-offset-2 ring-offset-surface',
              )}
            >
              <Ban className="size-4" />
            </button>
          </CusTooltip>
          {colors.map((color) => {
            const selected = String(color.id) === values.color
            return (
              <CusTooltip key={color.id} content={color.name}>
                <button
                  type="button"
                  aria-label={color.name}
                  aria-pressed={selected}
                  onClick={() => set('color', String(color.id))}
                  style={{ backgroundColor: color.hex_code }}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full border border-black/10 transition-shadow dark:border-white/15',
                    selected && 'ring-2 ring-primary ring-offset-2 ring-offset-surface',
                  )}
                >
                  {selected && (
                    <Check className={cn('size-4', isLight(color.hex_code) ? 'text-black' : 'text-white')} strokeWidth={3} />
                  )}
                </button>
              </CusTooltip>
            )
          })}
        </div>
      </div>

      {/* O'lchamlar: bir nechtasini tanlash mumkin */}
      <div className="flex flex-col gap-2.5">
        <span className="text-sm font-medium text-content">O'lcham</span>
        <SizeChips value={values.size} onChange={(sizes) => set('size', sizes)} />
        {errors.size && <p className="text-xs text-danger">{errors.size}</p>}
      </div>

      {/* Materiallar: guruhlangan chip'lar */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-content">Materiallar</span>
          {addLink('material', 'Yangi material')}
        </div>
        {groups.length === 0 ? (
          <p className="text-sm text-subtle">Hali material qo'shilmagan</p>
        ) : (
          <div className="flex flex-col gap-3">
            {groups.map((group) => (
              <div key={group.name} className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="w-24 shrink-0 text-xs text-muted">{group.name}</span>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((material) => {
                    const selected = values.material_ids.includes(material.id)
                    return (
                      <button
                        key={material.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleMaterial(material.id)}
                        className={cn(
                          'flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                          selected
                            ? 'border-primary bg-primary text-white'
                            : 'border-border-strong text-content hover:border-primary/60',
                        )}
                      >
                        {selected && <Check className="size-3" strokeWidth={3} />}
                        {material.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {dialog && (
        <CatalogItemDialog
          kind={dialog}
          open
          onOpenChange={(open) => !open && setDialog(null)}
          onCreated={(item) =>
            dialog === 'color'
              ? set('color', String(item.id))
              : set('material_ids', [...values.material_ids, item.id])
          }
        />
      )}
    </FormSection>
  )
}
