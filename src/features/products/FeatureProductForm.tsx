import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, PackageX } from 'lucide-react'
import { getErrorMessage } from '@/api/api-config/apiError'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusCard } from '@/components/shared/card/CusCard'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDialogDelete } from '@/components/ui/dialog/CusDialogDelete'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'
import { CusSwitch } from '@/components/ui/inputs/CusSwitch'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { toaster } from '@/components/ui/toaster/toaster'
import { CusTitle } from '@/components/ui/typography/CusTypography'
import { useParams } from '@/router/router'
import { navigate } from '@/utils/navigate'
import { useProduct, useProductMutations } from './api-hooks/useProducts'
import { AttributesSection } from './components/form/AttributesSection'
import { BasicSection } from './components/form/BasicSection'
import { ClassificationSection } from './components/form/ClassificationSection'
import { FormSection } from './components/form/FormSection'
import { PricingSection } from './components/form/PricingSection'
import { ProductPhotosSection } from './components/form/ProductPhotosSection'
import { ProductSummary } from './components/form/ProductSummary'
import {
  serverFieldErrors,
  toFormValues,
  toRequest,
  validate,
  type ProductFormErrors,
  type ProductFormValues,
  type VariantDraft,
} from './utils/productForm'

/** /products/new — yaratish, /products/:id — tahrirlash */
export default function FeatureProductForm() {
  const { id } = useParams()
  const productId = id ? Number(id) : undefined
  const { data: product, isLoading, isError } = useProduct(productId)

  if (productId !== undefined && isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <CusSkeleton height="280px" />
          <CusSkeleton height="320px" />
        </div>
        <CusSkeleton height="480px" />
      </div>
    )
  }

  if (productId !== undefined && (isError || !product)) {
    return (
      <CusCard>
        <CusEmptyState
          icon={<PackageX />}
          title="Mahsulot topilmadi"
          description="U o'chirilgan yoki havola noto'g'ri bo'lishi mumkin"
          action={<CusButton onClick={() => navigate('/products')}>Mahsulotlarga qaytish</CusButton>}
        />
      </CusCard>
    )
  }

  return <ProductEditor product={product} />
}

function ProductEditor({ product }: { product?: StoreProduct }) {
  const isEdit = Boolean(product)
  const { create, update, remove } = useProductMutations()

  const [values, setValues] = useState<ProductFormValues>(() => toFormValues(product))
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [dirty, setDirty] = useState(false)
  const [slugLocked, setSlugLocked] = useState(isEdit)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const set = useCallback(<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    setDirty(true)
  }, [])

  const setVariants = useCallback((updater: (prev: VariantDraft[]) => VariantDraft[]) => {
    setValues((prev) => ({ ...prev, variants: updater(prev.variants) }))
    setDirty(true)
  }, [])

  // Saqlanmagan o'zgarish bilan sahifani yopish/yangilashdan ogohlantirish
  useEffect(() => {
    if (!dirty) return
    const handler = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const photos = values.variants.flatMap((variant) => variant.photos)
  const isUploading = photos.some((item) => !item.photo && !item.error)
  const isSaving = create.isPending || update.isPending

  const scrollToError = () =>
    requestAnimationFrame(() =>
      document
        .querySelector('[aria-invalid="true"], [data-invalid]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    )

  const handleSave = async () => {
    const nextErrors = validate(values)
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors)
      toaster.create({ type: 'error', title: "Belgilangan maydonlarni to'ldiring" })
      scrollToError()
      return
    }
    if (isUploading) {
      toaster.create({ type: 'info', title: 'Rasmlar hali yuklanmoqda, biroz kuting' })
      return
    }

    try {
      const body = toRequest(values)
      if (product) {
        await update.mutateAsync({ id: product.id, body })
        setDirty(false)
        toaster.create({ type: 'success', title: 'Saqlandi' })
      } else {
        await create.mutateAsync(body)
        setDirty(false)
        toaster.create({ type: 'success', title: "Mahsulot qo'shildi" })
        navigate('/products')
      }
    } catch (err) {
      const fieldErrors = serverFieldErrors(err)
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors)
        scrollToError()
      }
      toaster.create({ type: 'error', title: getErrorMessage(err) })
    }
  }

  const handleDelete = async () => {
    if (!product) return
    try {
      await remove.mutateAsync(product.id)
      setDirty(false)
      toaster.create({ type: 'success', title: `"${product.name}" o'chirildi` })
      navigate('/products')
    } catch (err) {
      toaster.create({ type: 'error', title: getErrorMessage(err) })
    }
  }

  const sectionProps = { values, errors, set }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-heading"
        >
          <ArrowLeft className="size-4" /> Mahsulotlar
        </button>
      </div>
      <CusTitle as="h1" size="lg" className="-mt-3 break-words">
        {isEdit ? product!.name : 'Yangi mahsulot'}
      </CusTitle>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-6">
          <ProductPhotosSection variants={values.variants} setVariants={setVariants} />
          <BasicSection
            {...sectionProps}
            slugLocked={slugLocked}
            onSlugLock={() => setSlugLocked(true)}
          />
          <ClassificationSection {...sectionProps} />
          <AttributesSection {...sectionProps} />
          <PricingSection {...sectionProps} />
          <FormSection title="Saytda ko'rinishi">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-heading">Rasmlarni xira ko'rsatish</p>
                <p className="text-xs text-muted">Mahsulot saytda bor, lekin rasmlari to'liq ko'rinmaydi</p>
              </div>
              <CusSwitch
                checked={values.blur_image_in_site}
                onChange={(checked) => set('blur_image_in_site', checked)}
              />
            </div>
          </FormSection>
        </div>

        <ProductSummary values={values} product={product} onDelete={() => setDeleteOpen(true)} />
      </div>

      {/* Pastki panel — har doim ko'rinadi */}
      <div className="sticky bottom-0 z-20 -mx-4 -mb-4 flex items-center justify-end gap-3 border-t border-border bg-surface/90 px-4 py-3 backdrop-blur md:-mx-6 md:-mb-6 md:px-6">
        {dirty && <span className="mr-auto text-xs text-muted">Saqlanmagan o'zgarishlar bor</span>}
        <CusButton variant="outline" onClick={() => navigate('/products')}>
          Bekor qilish
        </CusButton>
        <CusButton onClick={handleSave} isLoading={isSaving} isDisabled={isEdit && !dirty}>
          {isEdit ? 'Saqlash' : "Mahsulotni qo'shish"}
        </CusButton>
      </div>

      <CusDialogDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`"${product?.name}" o'chirilsinmi?`}
        description="Mahsulot saytdan ham olib tashlanadi. Bu amalni ortga qaytarib bo'lmaydi."
        onConfirm={handleDelete}
        isLoading={remove.isPending}
      />
    </div>
  )
}
