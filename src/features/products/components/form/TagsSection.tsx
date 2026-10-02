import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CusCombobox } from '@/components/ui/select/CusCombobox'
import { useTags } from '@/features/catalog/api-hooks/useCatalog'
import { CatalogItemDialog } from '@/features/catalog/modals/CatalogItemDialog'
import type { SectionProps } from '../../utils/productForm'
import { FormSection } from './FormSection'

export function TagsSection({ values, set }: SectionProps) {
  const { data: tags = [] } = useTags()
  const [tagDialog, setTagDialog] = useState(false)

  return (
    <FormSection title="Teglar">
      <div className="flex flex-col gap-1.5">
        <CusCombobox
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
