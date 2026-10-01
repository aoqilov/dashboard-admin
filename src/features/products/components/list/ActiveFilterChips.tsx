import { CusTag } from '@/components/ui/badge/CusTag'
import { useColors, useMaterials, useTags } from '@/features/catalog/api-hooks/useCatalog'
import type { CategoryTree } from '@/features/categories/utils/categoryTree'
import { formatDate } from '@/utils/format'
import { parseIds, type FilterKey, type ProductFilters } from '../../utils/useProductFilters'

interface ActiveFilterChipsProps {
  filters: ProductFilters
  tree?: CategoryTree
  /** × bosilganda shu kalitlar tozalanadi */
  onRemove: (keys: FilterKey[]) => void
  onClear: () => void
}

/** "a – b", bo'sh tomoni "…" */
const between = (from: string, to: string) => `${from || '…'} – ${to || '…'}`

/** Faol filtrlar belgilari (× bilan olib tashlanadi) */
export function ActiveFilterChips({ filters, tree, onRemove, onClear }: ActiveFilterChipsProps) {
  const { data: colors = [] } = useColors()
  const { data: tags = [] } = useTags()
  const { data: materials = [] } = useMaterials()

  const names = (ids: string, items: { id: number; name: string }[]) =>
    parseIds(ids)
      .map((id) => items.find((item) => item.id === id)?.name ?? '…')
      .join(', ')

  const chips: { keys: FilterKey[]; label: string }[] = []
  if (filters.q) chips.push({ keys: ['q'], label: `"${filters.q}"` })
  if (filters.category) {
    chips.push({ keys: ['category', 'subcategory'], label: tree?.byId.get(Number(filters.category))?.name ?? '…' })
  }
  if (filters.subcategory) {
    chips.push({ keys: ['subcategory'], label: tree?.byId.get(Number(filters.subcategory))?.name ?? '…' })
  }
  if (filters.color) {
    chips.push({ keys: ['color'], label: colors.find((c) => String(c.id) === filters.color)?.name ?? 'Rang' })
  }
  if (filters.mode) chips.push({ keys: ['mode'], label: filters.mode === 'sale' ? 'Sotuvda' : 'Ijarada' })
  if (filters.tags) chips.push({ keys: ['tags'], label: `Teg: ${names(filters.tags, tags)}` })
  if (filters.materials) chips.push({ keys: ['materials'], label: `Material: ${names(filters.materials, materials)}` })
  if (filters.brand) chips.push({ keys: ['brand'], label: `Brend: ${filters.brand}` })
  if (filters.manufacture) chips.push({ keys: ['manufacture'], label: `Ishlab chiqaruvchi: ${filters.manufacture}` })
  if (filters.price_min || filters.price_max) {
    chips.push({ keys: ['price_min', 'price_max'], label: `Narx ${between(filters.price_min, filters.price_max)}` })
  }
  if (filters.rent_min || filters.rent_max) {
    chips.push({ keys: ['rent_min', 'rent_max'], label: `Ijara ${between(filters.rent_min, filters.rent_max)}` })
  }
  if (filters.size_min || filters.size_max) {
    chips.push({ keys: ['size_min', 'size_max'], label: `O'lcham ${between(filters.size_min, filters.size_max)}` })
  }
  if (filters.date_from || filters.date_to) {
    chips.push({
      keys: ['date_from', 'date_to'],
      label: `Sana ${between(formatDate(filters.date_from), formatDate(filters.date_to))}`,
    })
  }
  if (filters.blur) chips.push({ keys: ['blur'], label: filters.blur === 'yes' ? 'Rasmi xira' : 'Rasmi oddiy' })

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <CusTag key={chip.keys.join()} size="sm" onClose={() => onRemove(chip.keys)}>
          {chip.label}
        </CusTag>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="ml-1 text-xs font-medium text-primary hover:underline dark:text-primary-light"
      >
        Hammasini tozalash
      </button>
    </div>
  )
}
