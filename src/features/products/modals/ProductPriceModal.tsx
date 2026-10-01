import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusFormDialog } from '@/components/ui/dialog/CusFormDialog'
import { useEntityForm } from '@/hooks/useEntityForm'
import { useProductMutations } from '../api-hooks/useProducts'
import { PricingFields } from '../components/form/PricingSection'
import { toFormValues, toPriceRequest, validatePrices } from '../utils/productForm'

interface ProductPriceModalProps {
  product: StoreProduct
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Narx va xizmatlarni tez o'zgartirish — faqat narx maydonlari PATCH qilinadi */
export function ProductPriceModal({ product, open, onOpenChange }: ProductPriceModalProps) {
  const { update } = useProductMutations()
  const { values, errors, set, handleSubmit, isSaving } = useEntityForm({
    initial: toFormValues(product),
    validate: validatePrices,
    toRequest: toPriceRequest,
    save: (body) => update.mutateAsync({ id: product.id, body }),
    successText: 'Narx saqlandi',
    onSuccess: () => onOpenChange(false),
  })

  return (
    <CusFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Narx va xizmatlar"
      description={product.name}
      onSubmit={handleSubmit}
      isSaving={isSaving}
    >
      <PricingFields values={values} errors={errors} set={set} />
    </CusFormDialog>
  )
}
