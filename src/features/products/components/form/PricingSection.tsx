import type { ReactNode } from 'react'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusSwitch } from '@/components/ui/inputs/CusSwitch'
import { formatPrice } from '@/utils/format'
import type { ProductFormValues, SectionProps } from '../../utils/productForm'
import { FormSection } from './FormSection'

type PriceKey = 'price_sale' | 'price_rental' | 'price_tailoring'

/** Yoqilganda narx maydoni ochiladi (progressive disclosure) */
function ServiceRow({ title, description, toggle, children }: {
  title: string
  description: string
  toggle?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-heading">{title}</p>
          <p className="text-xs text-muted">{description}</p>
        </div>
        {toggle}
      </div>
      {children}
    </div>
  )
}

export function PricingSection({ values, errors, set }: SectionProps) {
  const priceInput = (key: PriceKey, placeholder: string) => (
    <CusInput
      className="sm:max-w-xs"
      inputMode="decimal"
      placeholder={placeholder}
      value={values[key]}
      error={errors[key]}
      hint={formatPrice(values[key].replace(/\s/g, '').replace(',', '.')) ?? "so'mda"}
      onChange={(event) => set(key, event.target.value.replace(/[^\d.,\s]/g, ''))}
    />
  )

  const toggle = (key: keyof Pick<ProductFormValues, 'is_sellable' | 'is_rentable'>) => (
    <CusSwitch checked={values[key]} onChange={(checked) => set(key, checked)} />
  )

  return (
    <FormSection title="Narx va xizmatlar" description="Mahsulot bilan qaysi xizmatlar taklif qilinadi">
      <div className="flex flex-col divide-y divide-border">
        <ServiceRow title="Sotuv" description="Mijoz mahsulotni sotib oladi" toggle={toggle('is_sellable')}>
          {values.is_sellable && priceInput('price_sale', '1 450 000')}
        </ServiceRow>
        <ServiceRow title="Ijara" description="Mahsulot vaqtincha ijaraga beriladi" toggle={toggle('is_rentable')}>
          {values.is_rentable && priceInput('price_rental', '200 000')}
        </ServiceRow>
        <ServiceRow title="Tikib berish" description="Buyurtma asosida tikish narxi (ixtiyoriy)">
          {priceInput('price_tailoring', "Bo'sh — xizmat yo'q")}
        </ServiceRow>
      </div>
    </FormSection>
  )
}
