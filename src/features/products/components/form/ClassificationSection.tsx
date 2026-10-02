import { CusSelect } from '@/components/ui/select/CusSelect'
import { useCategories } from '@/features/categories/api-hooks/useCategories'
import { CategoryThumb } from '@/features/categories/components/CategoryThumb'
import type { StoreCategory } from '@/api/routes/stores-categories/storeCategories.types'
import type { SectionProps } from '../../utils/productForm'
import { FormSection } from './FormSection'

/** Select varianti: 40x40 muqova + nom */
function toOption(category: StoreCategory) {
  return {
    label: category.name,
    value: String(category.id),
    icon: <CategoryThumb category={category} className="size-10" />,
  }
}

export function ClassificationSection({ values, errors, set }: SectionProps) {
  const { data: tree } = useCategories()

  const subcategories = values.category ? (tree?.childrenOf.get(Number(values.category)) ?? []) : []

  return (
    <FormSection title="Tasnif" description="Mijoz mahsulotni saytda qayerdan topadi">
      <div className="grid gap-5 sm:grid-cols-2">
        <CusSelect
          label="Kategoriya"
          isRequired
          size="lg"
          fullHeight
          placeholder="Tanlang"
          errorText={errors.category}
          options={(tree?.roots ?? []).map(toOption)}
          value={values.category ? [values.category] : []}
          onChange={([value]) => {
            set('category', value ?? '')
            set('subcategory', '')
          }}
        />
        <CusSelect
          label="Subkategoriya"
          size="lg"
          fullHeight
          clearable
          placeholder={!values.category ? 'Avval kategoriya' : subcategories.length ? 'Tanlang' : "Subkategoriya yo'q"}
          isDisabled={subcategories.length === 0}
          options={subcategories.map(toOption)}
          value={values.subcategory ? [values.subcategory] : []}
          onChange={([value]) => set('subcategory', value ?? '')}
        />
      </div>
    </FormSection>
  )
}
