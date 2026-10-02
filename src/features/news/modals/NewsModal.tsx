import { useState } from 'react'
import { MousePointerClick } from 'lucide-react'
import type { NewsType, StoreNews, StoreNewsRequest } from '@/api/routes/stores-news/storeNews.types'
import { ImageField } from '@/components/shared/image-field/ImageField'
import { ScheduleStatusBadge } from '@/components/shared/status/ScheduleStatusBadge'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDatePicker } from '@/components/ui/calendar/CusDatePicker'
import { CusFormDialog } from '@/components/ui/dialog/CusFormDialog'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusTextArea } from '@/components/ui/inputs/CusTextArea'
import { CusSelect } from '@/components/ui/select/CusSelect'
import { CusLabel } from '@/components/ui/typography/CusTypography'
import { useEntityForm, type FormErrors } from '@/hooks/useEntityForm'
import { useAllProducts } from '@/features/products/api-hooks/useProducts'
import type { CrudModalProps } from '@/features/store/components/CrudSection'
import { navigate } from '@/utils/navigate'
import { dateToIsoEnd, dateToIsoStart, isoToDateInput, scheduleStatus } from '@/utils/schedule'
import { SLUG_PATTERN, slugify } from '@/utils/slugify'
import { useNewsMutations } from '../api-hooks/useNews'
import { NewsProductList } from '../components/NewsProductList'
import { startNewsPicking, type NewsDraft, type NewsFormValues } from '../utils/newsDraft'
import { NEWS_TYPES } from '../utils/newsTypes'

interface NewsModalProps extends CrudModalProps<StoreNews> {
  /** Mahsulot tanlash sahifasidan qaytilganda — saqlab qo'yilgan forma */
  draft?: NewsDraft
}

function toValues(item: StoreNews | null): NewsFormValues {
  return {
    title: item?.title ?? '',
    news_type: item?.news_type ?? '',
    slug: item?.slug ?? '',
    description: item?.description ?? '',
    starts: isoToDateInput(item?.starts_at),
    ends: isoToDateInput(item?.ends_at),
    products: item?.products ?? [],
    image: null,
  }
}

function validate(values: NewsFormValues): FormErrors<NewsFormValues> {
  return {
    title: values.title.trim() ? undefined : 'Sarlavhani kiriting',
    news_type: values.news_type ? undefined : 'Turini tanlang',
    slug: !values.slug ? 'Havolani kiriting' : SLUG_PATTERN.test(values.slug) ? undefined : "Faqat lotin harf, raqam, '-' va '_'",
    starts: values.starts ? undefined : 'Boshlanish sanasini tanlang',
    ends: !values.ends ? 'Tugash sanasini tanlang' : values.starts && values.ends < values.starts ? "Tugash sanasi boshlanishdan oldin bo'lmasin" : undefined,
  }
}

/** Rasm tanlangan bo'lsa — multipart/form-data, aks holda JSON */
function toRequest(values: NewsFormValues): StoreNewsRequest | FormData {
  const starts_at = dateToIsoStart(values.starts)
  const ends_at = dateToIsoEnd(values.ends)
  const body: StoreNewsRequest = {
    title: values.title.trim(),
    news_type: values.news_type as NewsType,
    slug: values.slug,
    description: values.description.trim(),
    starts_at,
    ends_at,
    // Navbat: boshlanishi kelmagan — draft, muddat ichida — active, tugagan — archived
    status: scheduleStatus({ starts_at, ends_at }),
    products: values.products,
  }
  if (!values.image) return body

  const form = new FormData()
  form.append('image', values.image)
  for (const [key, value] of Object.entries(body)) {
    if (Array.isArray(value)) value.forEach((item) => form.append(key, String(item)))
    else if (value != null) form.append(key, String(value))
  }
  return form
}

/**
 * Yangilik qo'shish / tahrirlash. Mahsulotlar "Tovarlarni kiritish" orqali /products sahifasida
 * belgilanadi (forma saqlanib turadi).
 */
export function NewsModal({ item, open, onOpenChange, draft }: NewsModalProps) {
  const { data: products = [] } = useAllProducts()
  const { create, update } = useNewsMutations()
  // Tahrirda slug o'zgarmaydi (saytdagi havola buzilmasin), yangisida nomdan yasaladi
  const [slugLocked, setSlugLocked] = useState(draft?.slugLocked ?? Boolean(item))
  const { values, errors, set, handleSubmit, isSaving } = useEntityForm({
    initial: draft ?? toValues(item),
    validate,
    toRequest,
    save: (body) => (item ? update.mutateAsync({ id: item.id, body }) : create.mutateAsync(body)),
    successText: item ? 'Saqlandi' : "Yangilik qo'shildi",
    onSuccess: () => onOpenChange(false),
  })

  const byId = new Map(products.map((product) => [product.id, product]))
  const phase =
    values.starts && values.ends
      ? scheduleStatus({ starts_at: dateToIsoStart(values.starts), ends_at: dateToIsoEnd(values.ends) })
      : null

  /** Formani saqlab, /products da tanlash rejimini yoqadi */
  const pickProducts = () => {
    startNewsPicking(item?.id ?? null, values, slugLocked)
    navigate('/products')
  }

  return (
    <CusFormDialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      maxWidth="1100px"
      title={item ? 'Yangilikni tahrirlash' : 'Yangi yangilik'}
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
            placeholder="Yangi kolleksiya taqdimoti"
            value={values.title}
            error={errors.title}
            onChange={(event) => {
              set('title', event.target.value)
              if (!slugLocked) set('slug', slugify(event.target.value))
            }}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <CusSelect
              label="Turi"
              isRequired
              size="md"
              placeholder="Tanlang"
              errorText={errors.news_type}
              options={NEWS_TYPES.map(({ value, label }) => ({ value, label }))}
              value={values.news_type ? [values.news_type] : []}
              onChange={([value]) => set('news_type', (value ?? '') as NewsType | '')}
            />
            <CusInput
              label="Havola (slug) *"
              maxLength={255}
              placeholder="yangi-kolleksiya"
              value={values.slug}
              error={errors.slug}
              onChange={(event) => {
                setSlugLocked(true)
                set('slug', event.target.value)
              }}
            />
          </div>

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
        </div>

        {/* O'ng: tavsif va mahsulotlar */}
        <div className="flex min-w-0 flex-col gap-5">
          <CusTextArea
            label="Tavsif"
            rows={4}
            placeholder="Yangilik haqida batafsil"
            value={values.description}
            errorText={errors.description}
            onChange={(event) => set('description', event.target.value)}
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <CusLabel>Mahsulotlar · {values.products.length} ta</CusLabel>
              <CusButton type="button" variant="outline" size="sm" leftIcon={<MousePointerClick />} onClick={pickProducts}>
                {values.products.length ? "Mahsulotlarni o'zgartirish" : 'Tovarlarni kiritish'}
              </CusButton>
            </div>

            {values.products.length > 0 ? (
              <div className="max-h-96 overflow-y-auto rounded-card border border-border">
                <NewsProductList ids={values.products} products={byId} onChange={(ids) => set('products', ids)} />
              </div>
            ) : (
              <p className="rounded-card border border-dashed border-border-strong px-4 py-8 text-center text-sm text-muted">
                "Tovarlarni kiritish" ni bosing — mahsulotlar sahifasida yangilikka bog'lanadigan mahsulotlarni belgilaysiz
              </p>
            )}
          </div>
        </div>
      </div>
    </CusFormDialog>
  )
}
