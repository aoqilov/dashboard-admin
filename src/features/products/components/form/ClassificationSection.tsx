import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CusSelect } from '@/components/ui/select/CusSelect'
import { CusCombobox } from '@/components/ui/select/CusCombobox'
import { useTags } from '@/features/catalog/api-hooks/useCatalog'
import { CatalogItemDialog } from '@/features/catalog/components/CatalogItemDialog'
import { useCategories } from '@/features/categories/api-hooks/useCategories'
import type { SectionProps } from '../../utils/productForm'
import { FormSection } from './FormSection'

export function ClassificationSection({ values, errors, set }: SectionProps) {
  const { data: tree } = useCategories()
  const { data: tags = [] } = useTags()
  const [tagDialog, setTagDialog] = useState(false)

  const subcategories = values.category ? (tree?.childrenOf.get(Number(values.category)) ?? []) : []

  return (
    <FormSection title="Tasnif" description="Mijoz mahsulotni saytda qayerdan topadi">
      <div className="grid gap-5 sm:grid-cols-2">
        <CusSelect
          label="Kategoriya"
          isRequired
          size="md"
          placeholder="Tanlang"
          errorText={errors.category}
          options={(tree?.roots ?? []).map((c) => ({ label: c.name, value: String(c.id) }))}
          value={values.category ? [values.category] : []}
          onChange={([value]) => {
            set('category', value ?? '')
            set('subcategory', '')
          }}
        />
        <CusSelect
          label="Subkategoriya"
          size="md"
          clearable
          placeholder={!values.category ? 'Avval kategoriya' : subcategories.length ? 'Tanlang' : "Subkategoriya yo'q"}
          isDisabled={subcategories.length === 0}
          options={subcategories.map((c) => ({ label: c.name, value: String(c.id) }))}
          value={values.subcategory ? [values.subcategory] : []}
          onChange={([value]) => set('subcategory', value ?? '')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <CusCombobox
          label="Teglar"
          multiple
          size="md"
          placeholder="Qidiring yoki tanlang"
          emptyText="Teg topilmadi"
          options={tags.map((tag) => ({ label: tag.name, value: String(tag.id) }))}
          value={values.tags.map(String)}
          onChange={(ids) => set('tags', ids.map(Number))}
        />
        <button
          type="button"
          onClick={() => setTagDialog(true)}
          className="flex items-center gap-1 self-start text-xs font-medium text-primary hover:underline dark:text-primary-light"
        >
          <Plus className="size-3.5" /> Yangi teg
        </button>
      </div>

      {tagDialog && (
        <CatalogItemDialog
          kind="tag"
          open
          onOpenChange={setTagDialog}
          onCreated={(tag) => set('tags', [...values.tags, tag.id])}
        />
      )}
    </FormSection>
  )
}
