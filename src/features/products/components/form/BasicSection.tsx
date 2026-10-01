import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusTextArea } from '@/components/ui/inputs/CusTextArea'
import { slugify } from '@/utils/slugify'
import type { SectionProps } from '../../utils/productForm'
import { FormSection } from './FormSection'

interface BasicSectionProps extends SectionProps {
  /** false bo'lsa slug nomdan avtomatik yasaladi (yangi mahsulot) */
  slugLocked: boolean
  onSlugLock: () => void
}

export function BasicSection({ values, errors, set, slugLocked, onSlugLock }: BasicSectionProps) {
  return (
    <FormSection title="Asosiy ma'lumot">
      <CusInput
        label="Nomi *"
        placeholder="Kechki ko'ylak"
        value={values.name}
        error={errors.name}
        onChange={(event) => {
          set('name', event.target.value)
          if (!slugLocked) set('slug', slugify(event.target.value))
        }}
      />
      <CusInput
        label="Havola (slug) *"
        placeholder="kechki-koylak"
        value={values.slug}
        error={errors.slug}
        hint={slugLocked ? 'Saytdagi manzil: /products/' + (values.slug || '…') : 'Nomdan avtomatik yasaladi'}
        onChange={(event) => {
          onSlugLock()
          set('slug', event.target.value)
        }}
      />
      <CusTextArea
        label="Tavsif"
        placeholder="Mato, bichim, qaysi tadbir uchun mos…"
        autoresize
        rows={4}
        value={values.description}
        onChange={(event) => set('description', event.target.value)}
      />
    </FormSection>
  )
}
