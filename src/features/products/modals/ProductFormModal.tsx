import { useCallback, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getErrorMessage } from '@/api/api-config/apiError'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDialog } from '@/components/ui/dialog/CusDialog'
import { CusDialogDelete } from '@/components/ui/dialog/CusDialogDelete'
import { CusSwitch } from '@/components/ui/inputs/CusSwitch'
import { CusSteps } from '@/components/ui/steps/CusSteps'
import { toaster } from '@/components/ui/toaster/toaster'
import { formatCompact, formatDate } from '@/utils/format'
import { useProductMutations } from '../api-hooks/useProducts'
import { AttributesSection } from '../components/form/AttributesSection'
import { BasicSection } from '../components/form/BasicSection'
import { ClassificationSection } from '../components/form/ClassificationSection'
import { FormSection } from '../components/form/FormSection'
import { PricingSection } from '../components/form/PricingSection'
import { ProductPhotosSection } from '../components/form/ProductPhotosSection'
import {
  duplicateValues,
  firstStepWithError,
  hasErrors,
  PRODUCT_STEPS,
  serverFieldErrors,
  stepErrors,
  toFormValues,
  toRequest,
  validate,
  type ProductFormErrors,
  type ProductFormValues,
  type VariantDraft,
} from '../utils/productForm'

interface ProductFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Berilsa — tahrirlash */
  product?: StoreProduct
  /** Berilsa — shu mahsulotning nusxasi yaratiladi (rasmlarsiz) */
  source?: StoreProduct
}

/**
 * Mahsulot qo'shish / tahrirlash — 2 qadam:
 * 1) asosiy ma'lumot (barcha majburiy maydonlar), 2) rasmlar va xususiyatlar.
 * Tashqariga bosilganda yopilmaydi; saqlanmagan o'zgarish bo'lsa yopishdan oldin so'raladi.
 */
export function ProductFormModal({ open, onOpenChange, product, source }: ProductFormModalProps) {
  const isEdit = Boolean(product)
  const { create, update } = useProductMutations()

  const [values, setValues] = useState<ProductFormValues>(() =>
    source ? duplicateValues(source) : toFormValues(product),
  )
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [dirty, setDirty] = useState(false)
  const [slugLocked, setSlugLocked] = useState(isEdit)
  const [step, setStep] = useState(0)
  const [confirmClose, setConfirmClose] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const set = useCallback(<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    setDirty(true)
  }, [])

  const setVariants = useCallback((updater: (prev: VariantDraft[]) => VariantDraft[]) => {
    setValues((prev) => ({ ...prev, variants: updater(prev.variants) }))
    setDirty(true)
  }, [])

  const isUploading = values.variants.some((variant) => variant.photos.some((item) => !item.photo && !item.error))
  const isSaving = create.isPending || update.isPending

  /** Qadam almashganda modal ichi tepaga qaytadi (content — Dialog.Body ning bevosita bolasi) */
  const goToStep = (next: number) => {
    setStep(next)
    contentRef.current?.parentElement?.scrollTo({ top: 0 })
  }

  const showErrors = (next: ProductFormErrors) => {
    setErrors(next)
    const errorStep = firstStepWithError(next)
    if (errorStep !== null) setStep(errorStep)
    // Yangi qadam chizilgandan keyin birinchi xatoga
    requestAnimationFrame(() =>
      contentRef.current
        ?.querySelector('[aria-invalid="true"], [data-invalid]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    )
  }

  const handleNext = () => {
    const errorsHere = stepErrors(validate(values), 0)
    if (hasErrors(errorsHere)) return showErrors(errorsHere)
    goToStep(1)
  }

  const handleSave = async () => {
    const nextErrors = validate(values)
    if (hasErrors(nextErrors)) {
      showErrors(nextErrors)
      toaster.create({ type: 'error', title: "Belgilangan maydonlarni to'ldiring" })
      return
    }
    if (isUploading) {
      toaster.create({ type: 'info', title: 'Rasmlar hali yuklanmoqda, biroz kuting' })
      return
    }

    try {
      const body = toRequest(values)
      if (product) await update.mutateAsync({ id: product.id, body })
      else await create.mutateAsync(body)
      toaster.create({ type: 'success', title: product ? 'Saqlandi' : "Mahsulot qo'shildi" })
      onOpenChange(false)
    } catch (err) {
      const fieldErrors = serverFieldErrors(err)
      if (hasErrors(fieldErrors)) showErrors(fieldErrors)
      toaster.create({ type: 'error', title: getErrorMessage(err) })
    }
  }

  /** X, Esc va "Bekor qilish" — o'zgarish bo'lsa avval so'raladi */
  const requestClose = () => (dirty ? setConfirmClose(true) : onOpenChange(false))

  const title = isEdit ? 'Mahsulotni tahrirlash' : source ? 'Mahsulot nusxasi' : 'Yangi mahsulot'
  const description = product
    ? `${product.name} · Ko'rishlar: ${formatCompact(product.views)} · Saqlaganlar: ${formatCompact(product.in_customers_saved)} · Yangilangan: ${formatDate(product.updated_at)}`
    : source
      ? `"${source.name}" asosida. Rasmlarni 2-qadamda qo'shing`
      : undefined

  const sectionProps = { values, errors, set }
  const status = isUploading ? 'Rasmlar yuklanmoqda…' : dirty ? "Saqlanmagan o'zgarishlar bor" : ''

  return (
    <>
      <CusDialog
        open={open}
        onOpenChange={(next) => !next && requestClose()}
        size="xl"
        isPersistent
        scrollBehavior="inside"
        title={title}
        description={description}
        footer={
          // Tor ekranda tugmalar keyingi qatorga o'tadi
          <div className="flex w-full flex-wrap items-center justify-end gap-3">
            {status && <span className="mr-auto hidden text-xs text-muted sm:block">{status}</span>}
            {step === 0 ? (
              <>
                <CusButton variant="outline" onClick={requestClose}>
                  Bekor qilish
                </CusButton>
                {isEdit && (
                  <CusButton variant="outline" onClick={handleSave} isLoading={isSaving} isDisabled={!dirty}>
                    Saqlash
                  </CusButton>
                )}
                <CusButton rightIcon={<ArrowRight />} onClick={handleNext}>
                  Keyingi
                </CusButton>
              </>
            ) : (
              <>
                <CusButton variant="outline" leftIcon={<ArrowLeft />} onClick={() => goToStep(0)}>
                  Orqaga
                </CusButton>
                <CusButton onClick={handleSave} isLoading={isSaving} isDisabled={isEdit && !dirty}>
                  {isEdit ? 'Saqlash' : "Mahsulotni qo'shish"}
                </CusButton>
              </>
            )}
          </div>
        }
      >
        <div ref={contentRef} className="flex flex-col gap-6">
          <CusSteps size="sm" step={step} items={PRODUCT_STEPS} />

          {step === 0 ? (
            <div className="flex flex-col divide-y divide-border">
              <BasicSection {...sectionProps} slugLocked={slugLocked} onSlugLock={() => setSlugLocked(true)} />
              <ClassificationSection {...sectionProps} />
              <PricingSection {...sectionProps} />
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              <ProductPhotosSection variants={values.variants} setVariants={setVariants} />
              <AttributesSection {...sectionProps} />
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
          )}
        </div>
      </CusDialog>

      <CusDialogDelete
        open={confirmClose}
        onOpenChange={setConfirmClose}
        title="O'zgarishlar saqlanmagan"
        description="Chiqsangiz, kiritilgan ma'lumotlar yo'qoladi."
        confirmText="Chiqish"
        cancelText="Davom etish"
        onConfirm={() => {
          setConfirmClose(false)
          onOpenChange(false)
        }}
      />
    </>
  )
}
