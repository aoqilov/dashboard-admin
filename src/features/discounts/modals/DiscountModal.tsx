import { MousePointerClick } from 'lucide-react'
import type { StoreDiscount, StoreDiscountRequest } from '@/api/routes/stores-discounts/storeDiscounts.types'
import { ImageField } from '@/components/shared/image-field/ImageField'
import { ScheduleStatusBadge } from '@/components/shared/status/ScheduleStatusBadge'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDatePicker } from '@/components/ui/calendar/CusDatePicker'
import { CusFormDialog } from '@/components/ui/dialog/CusFormDialog'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusTextArea } from '@/components/ui/inputs/CusTextArea'
import { CusLabel } from '@/components/ui/typography/CusTypography'
import { useEntityForm, type FormErrors } from '@/hooks/useEntityForm'
import { useAllProducts } from '@/features/products/api-hooks/useProducts'
import type { CrudModalProps } from '@/features/store/components/CrudSection'
import { formatPrice } from '@/utils/format'
import { navigate } from '@/utils/navigate'
import { dateToIsoEnd, dateToIsoStart, isoToDateInput, scheduleStatus } from '@/utils/schedule'
import { useDiscountMutations } from '../api-hooks/useDiscounts'
import { DiscountRowList } from '../components/DiscountRowList'
import { startPicking, type DiscountDraft, type DiscountFormValues } from '../utils/discountDraft'
import { parseDiscountValue } from '../utils/discountPrice'

interface DiscountModalProps extends CrudModalProps<StoreDiscount> {
  /** Mahsulot tanlash sahifasidan qaytilganda — saqlab qo'yilgan forma */
  draft?: DiscountDraft
}

function toValues(item: StoreDiscount | null): DiscountFormValues {
  return {
    title: item?.title ?? '',
    description: item?.description ?? '',
    starts: isoToDateInput(item?.starts_at),
    ends: isoToDateInput(item?.ends_at),
    image: null,
    rows: (item?.products ?? []).map((row) => ({
      product: String(row.product),
      type: row.discount_type,
      value: String(Number(row.value)),
    })),
  }
}

/** Mahsulotlar ichma-ich obyektlar — multipart'ga sig'maydi, shuning uchun rasm alohida multipart so'rov bilan yuboriladi */
function toRequest(values: DiscountFormValues) {
  const starts_at = dateToIsoStart(values.starts)
  const ends_at = dateToIsoEnd(values.ends)
  const body: StoreDiscountRequest = {
    title: values.title.trim(),
    description: values.description.trim(),
    starts_at,
    ends_at,
    // Navbat: boshlanishi kelmagan — draft, muddat ichida — active, tugagan — archived
    status: scheduleStatus({ starts_at, ends_at }),
    products: values.rows.map((row) => ({
      product: Number(row.product),
      discount_type: row.type,
      value: String(parseDiscountValue(row.value)),
    })),
  }
  return { body, image: values.image }
}

/**
 * Chegirma qo'shish / tahrirlash. Mahsulotlar "Mahsulot tanlash" orqali /products sahifasida
 * belgilanadi (forma saqlanib turadi), shu yerda esa chegirma qiymatlari sozlanadi.
 */
export function DiscountModal({ item, open, onOpenChange, draft }: DiscountModalProps) {
  const { data: products = [] } = useAllProducts()
  const { create, update } = useDiscountMutations()
  const byId = new Map(products.map((product) => [String(product.id), product]))

  const validate = (values: DiscountFormValues): FormErrors<DiscountFormValues> => {
    let rowsError: string | undefined = values.rows.length ? undefined : 'Kamida bitta mahsulot tanlang'
    values.rows.forEach((row) => {
      if (rowsError) return
      const product = byId.get(row.product)
      const name = product?.name ?? `#${row.product}`
      const value = parseDiscountValue(row.value)
      if (!row.value.trim() || !Number.isFinite(value) || value <= 0) rowsError = `${name}: chegirma qiymatini kiriting`
      else if (row.type === 'percentage' && value > 100) rowsError = `${name}: foiz 100 dan oshmasin`
      else if (row.type === 'fixed_amount' && product?.price_sale && value > Number(product.price_sale)) {
        rowsError = `${name}: summa sotuv narxidan (${formatPrice(product.price_sale)}) oshmasin`
      }
    })
    return {
      title: values.title.trim() ? undefined : 'Sarlavhani kiriting',
      starts: values.starts ? undefined : 'Boshlanish sanasini tanlang',
      ends: !values.ends
        ? 'Tugash sanasini tanlang'
        : values.starts && values.ends < values.starts
          ? "Tugash sanasi boshlanishdan oldin bo'lmasin"
          : undefined,
      rows: rowsError,
    }
  }

  const { values, errors, set, handleSubmit, isSaving } = useEntityForm({
    initial: draft ?? toValues(item),
    validate,
    toRequest,
    save: async ({ body, image }) => {
      const saved = item ? await update.mutateAsync({ id: item.id, body }) : await create.mutateAsync(body)
      if (!image) return
      const form = new FormData()
      form.append('image', image)
      await update.mutateAsync({ id: saved.id, body: form })
    },
    successText: item ? 'Saqlandi' : "Chegirma qo'shildi",
    onSuccess: () => onOpenChange(false),
  })

  const phase =
    values.starts && values.ends
      ? scheduleStatus({ starts_at: dateToIsoStart(values.starts), ends_at: dateToIsoEnd(values.ends) })
      : null

  /** Formani saqlab, /products da chegirma tanlash rejimini yoqadi */
  const pickProducts = () => {
    startPicking(item?.id ?? null, values)
    navigate('/products')
  }

  return (
    <CusFormDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      maxWidth="1100px"
      title={item ? 'Chegirmani tahrirlash' : 'Yangi chegirma'}
      onSubmit={handleSubmit}
      isSaving={isSaving}
    >
      <div className="grid gap-8 lg:grid-cols-2">
      {/* Chap: umumiy ma'lumot */}
      <div className="flex min-w-0 flex-col gap-5">
      <ImageField
        label="Rasm (ixtiyoriy)"
        current={item?.image}
        file={values.image}
        onChange={(file) => set('image', file)}
      />

      <CusInput
        label="Sarlavha *"
        autoFocus
        maxLength={255}
        placeholder="Kuzgi chegirmalar"
        value={values.title}
        error={errors.title}
        onChange={(event) => set('title', event.target.value)}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <CusDatePicker
          label="Boshlanishi"
          isRequired
          size="md"
          value={values.starts}
          errorText={errors.starts}
          onChange={(value) => set('starts', value)}
        />
        <CusDatePicker
          label="Tugashi"
          isRequired
          size="md"
          min={values.starts || undefined}
          value={values.ends}
          errorText={errors.ends}
          onChange={(value) => set('ends', value)}
        />
      </div>
      {phase && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          Holati: <ScheduleStatusBadge status={phase} />
          {phase === 'draft' && "boshlanish sanasi kelganda o'zi faol bo'ladi"}
          {phase === 'active' && "tugash sanasidan keyin arxivga o'tadi"}
        </div>
      )}

      <CusTextArea
        label="Tavsif"
        rows={2}
        placeholder="Chegirma haqida qisqacha"
        value={values.description}
        onChange={(event) => set('description', event.target.value)}
      />

      </div>

      {/* O'ng: mahsulotlar */}
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <CusLabel>
            Mahsulotlar · {values.rows.length} ta<span className="text-danger"> *</span>
          </CusLabel>
          <CusButton type="button" variant="outline" size="sm" leftIcon={<MousePointerClick />} onClick={pickProducts}>
            {values.rows.length ? "Mahsulotlarni o'zgartirish" : 'Tovarlarni kiritish'}
          </CusButton>
        </div>

        {values.rows.length > 0 ? (
          <div className="max-h-112 overflow-y-auto rounded-card border border-border">
            <DiscountRowList rows={values.rows} products={byId} onChange={(rows) => set('rows', rows)} />
          </div>
        ) : (
          <p className="rounded-card border border-dashed border-border-strong px-4 py-8 text-center text-sm text-muted">
            "Tovarlarni kiritish" ni bosing — mahsulotlar sahifasida chegirma uchun mahsulotlarni belgilaysiz
          </p>
        )}
        {errors.rows && <p className="text-xs text-danger">{errors.rows}</p>}
      </div>
      </div>
    </CusFormDialog>
  )
}
