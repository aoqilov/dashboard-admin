import { useCallback, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getErrorMessage } from '@/api/api-config/apiError'
import { storeProductPhotos } from '@/api/routes/stores-product-photos/storeProductPhotos.api'
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
import { TagsSection } from '../components/form/TagsSection'
import { FormSection } from '../components/form/FormSection'
import { PricingSection } from '../components/form/PricingSection'
import { ProductPhotosSection } from '../components/form/ProductPhotosSection'
import { FORM_COLUMN, FORM_COLUMNS } from '../utils/formLayout'
import { patchPhoto, type PhotoState } from '../utils/photoState'
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
 * Mahsulot qo'shish / tahrirlash — 3 qadam:
 * 1) nom va tasnif, 2) narx va xususiyatlar, 3) rasmlar.
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

  /** 3-qadam: variantlar va joylanmagan rasmlar birga o'zgaradi (sudrash, yuklash) */
  const setPhotos = useCallback((updater: (prev: PhotoState) => PhotoState) => {
    setValues((prev) => ({ ...prev, ...updater({ variants: prev.variants, pool: prev.pool }) }))
    setErrors((prev) => (prev.pool ? { ...prev, pool: undefined } : prev))
    setDirty(true)
  }, [])

  /** Saqlash paytida variantlardagi yangi rasmlar yuklanmoqda */
  const [isUploading, setUploading] = useState(false)
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

  const isLastStep = step === PRODUCT_STEPS.length - 1

  /** Keyingi qadamga faqat shu qadamdagi maydonlar to'g'ri bo'lsa o'tiladi */
  const handleNext = () => {
    const errorsHere = stepErrors(validate(values), step)
    if (hasErrors(errorsHere)) return showErrors(errorsHere)
    goToStep(step + 1)
  }

  /**
   * Variantlarga qo'yilgan, hali yuklanmagan rasmlarni serverga yuklaydi (joylanmaganlari yuklanmaydi).
   * Yuklanganlari formaga yoziladi — qayta saqlashda takror yuklanmaydi. Biri yuklanmasa xato tashlanadi.
   */
  const uploadVariantPhotos = async () => {
    const pending = values.variants.flatMap((variant) => variant.photos).filter((item) => !item.photo && item.file)
    if (!pending.length) return values

    setUploading(true)
    setValues((prev) => pending.reduce((acc, item) => ({ ...acc, ...patchPhoto(acc, item.key, { uploading: true, error: undefined }) }), prev))
    try {
      const results = await Promise.allSettled(
        pending.map(async (item) => {
          const form = new FormData()
          form.append('image', item.file!)
          return storeProductPhotos.create(form)
        }),
      )

      let next = values
      let failed: unknown
      results.forEach((result, index) => {
        const key = pending[index].key
        if (result.status === 'fulfilled') {
          next = { ...next, ...patchPhoto(next, key, { photo: result.value, uploading: false, error: undefined }) }
        } else {
          failed ??= result.reason
          next = { ...next, ...patchPhoto(next, key, { uploading: false, error: getErrorMessage(result.reason, 'Yuklanmadi') }) }
        }
      })
      setValues(next)
      if (failed) throw failed
      return next
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    const nextErrors = validate(values)
    if (hasErrors(nextErrors)) {
      showErrors(nextErrors)
      toaster.create({ type: 'error', title: "Belgilangan maydonlarni to'ldiring" })
      return
    }
    try {
      const body = toRequest(await uploadVariantPhotos())
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
      ? `"${source.name}" asosida. Rasmlarni 3-qadamda qo'shing`
      : undefined

  const sectionProps = { values, errors, set }
  const status = isUploading ? 'Rasmlar yuklanmoqda…' : dirty ? "Saqlanmagan o'zgarishlar bor" : ''

  return (
    <>
      <CusDialog
        open={open}
        onOpenChange={(next) => !next && requestClose()}
        size="cover"
        isPersistent
        scrollBehavior="inside"
        title={title}
        description={description}
        footer={
          // Tor ekranda tugmalar keyingi qatorga o'tadi
          <div className="flex w-full flex-wrap items-center justify-end gap-3">
            {status && <span className="mr-auto hidden text-xs text-muted sm:block">{status}</span>}
            {step === 0 ? (
              <CusButton variant="outline" onClick={requestClose}>
                Bekor qilish
              </CusButton>
            ) : (
              <CusButton variant="outline" leftIcon={<ArrowLeft />} onClick={() => goToStep(step - 1)}>
                Orqaga
              </CusButton>
            )}
            {isLastStep ? (
              <CusButton onClick={handleSave} isLoading={isSaving || isUploading} isDisabled={isEdit && !dirty}>
                {isEdit ? 'Saqlash' : "Mahsulotni qo'shish"}
              </CusButton>
            ) : (
              <>
                {/* Tahrirlashda oxirgi qadamga borish shart emas */}
                {isEdit && (
                  <CusButton variant="outline" onClick={handleSave} isLoading={isSaving || isUploading} isDisabled={!dirty}>
                    Saqlash
                  </CusButton>
                )}
                <CusButton rightIcon={<ArrowRight />} onClick={handleNext}>
                  Keyingi
                </CusButton>
              </>
            )}
          </div>
        }
      >
        <div ref={contentRef} className="flex flex-col gap-6">
          <CusSteps size="sm" step={step} items={PRODUCT_STEPS} />

          {step === 0 && (
            <div className={FORM_COLUMNS}>
              <div className={FORM_COLUMN}>
                <BasicSection {...sectionProps} slugLocked={slugLocked} onSlugLock={() => setSlugLocked(true)} />
                <TagsSection {...sectionProps} />
              </div>
              <div className={FORM_COLUMN}>
                <ClassificationSection {...sectionProps} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className={FORM_COLUMNS}>
              <div className={FORM_COLUMN}>
                <PricingSection {...sectionProps} />
              </div>
              <div className={FORM_COLUMN}>
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
            </div>
          )}

          {/* Rasmlar — butun en bo'ylab */}
          {step === 2 && (
            <ProductPhotosSection
              variants={values.variants}
              pool={values.pool}
              error={errors.pool}
              onChange={setPhotos}
            />
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
