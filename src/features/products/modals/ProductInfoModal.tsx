import { useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, Heart, Pencil } from 'lucide-react'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { CusTag } from '@/components/ui/badge/CusTag'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDataList } from '@/components/ui/data-list/CusDataList'
import { CusDialog } from '@/components/ui/dialog/CusDialog'
import { useDiscountRules } from '@/features/discounts/api-hooks/useDiscounts'
import { saleDiscount } from '@/features/discounts/utils/discountPrice'
import { useColors, useMaterials, useTags } from '@/features/catalog/api-hooks/useCatalog'
import { useCategories } from '@/features/categories/api-hooks/useCategories'
import { cn } from '@/utils/cn'
import { formatCompact, formatDate, formatPrice } from '@/utils/format'
import { photoUrl } from '@/utils/media'
import { AvailabilityBadges, ProductImage } from '../components/shared/ProductBits'
import { VARIANT_COUNT } from '../utils/productForm'
import { categoryPath } from '../utils/productView'

interface ProductInfoModalProps {
  product: StoreProduct
  open: boolean
  onOpenChange: (open: boolean) => void
  /** "Tahrirlash" bosilganda */
  onEdit: (product: StoreProduct) => void
}

/** Slayderdagi oldingi/keyingi tugma */
function SlideArrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={side === 'left' ? 'Oldingi rasm' : 'Keyingi rasm'}
      onClick={onClick}
      className={cn(
        'absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70',
        side === 'left' ? 'left-3' : 'right-3',
      )}
    >
      <Icon className="size-5" />
    </button>
  )
}

const EMPTY = <span className="text-subtle">—</span>

/** Mahsulot haqida to'liq ma'lumot (faqat ko'rish): rasmlar, narxlar, tasnif, xususiyatlar */
export function ProductInfoModal({ product, open, onOpenChange, onEdit }: ProductInfoModalProps) {
  const { data: tree } = useCategories()
  const { data: colors = [] } = useColors()
  const { data: tags = [] } = useTags()
  const { data: materials = [] } = useMaterials()
  const { data: rules } = useDiscountRules()
  const discount = saleDiscount(product, rules?.get(product.id))

  // Rasmli variantlar (eng ko'pi bilan VARIANT_COUNT ta). Tanlangan variantning rasmlari slayderda
  const variants = product.variants
    .slice(0, VARIANT_COUNT)
    .map((variant, i) => ({ number: i + 1, photos: variant.photos }))
    .filter((variant) => variant.photos.length > 0)
  const [variantIndex, setVariantIndex] = useState(0)
  const [index, setIndex] = useState(0)
  const variant = variants[variantIndex]
  const slides = variant?.photos ?? []
  const current = slides[index]
  const go = (step: number) => setIndex((prev) => (prev + step + slides.length) % slides.length)
  const selectVariant = (i: number) => {
    setVariantIndex(i)
    setIndex(0)
  }

  const color = colors.find((item) => item.id === product.color)
  const productTags = tags.filter((tag) => product.tags?.includes(tag.id))
  const productMaterials = materials.filter((material) => product.material_ids?.includes(material.id))

  const prices = [
    { label: 'Sotuv narxi', value: product.is_sellable ? formatPrice(product.price_sale) : null },
    { label: 'Ijara narxi', value: product.is_rentable ? formatPrice(product.price_rental) : null },
    { label: 'Tikish narxi', value: formatPrice(product.price_tailoring) },
  ]

  return (
    <CusDialog
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      maxWidth="1240px"
      scrollBehavior="inside"
      title={product.name}
      description={`/${product.slug}`}
      footer={
        <>
          <CusButton variant="outline" onClick={() => onOpenChange(false)}>
            Yopish
          </CusButton>
          <CusButton leftIcon={<Pencil />} onClick={() => onEdit(product)}>
            Tahrirlash
          </CusButton>
        </>
      }
    >
      <div className="grid gap-8 pt-4 md:grid-cols-[minmax(0,4.8fr)_minmax(0,5fr)]">
        {/* Rasmlar: chapda variant tugmalari, yonida slayder */}
        <div className="flex min-w-0 gap-4">
          {variants.length > 0 && (
            <div className="flex w-24 shrink-0 flex-col gap-2">
              {variants.map((item, i) => (
                <button
                  key={item.number}
                  type="button"
                  onClick={() => selectVariant(i)}
                  className={cn(
                    'flex flex-col gap-1.5 rounded-control border-2 p-1.5 text-left transition-colors',
                    i === variantIndex ? 'border-primary bg-primary/5' : 'border-border hover:border-border-strong hover:bg-hover',
                  )}
                >
                  <ProductImage src={photoUrl(item.photos[0], 'small')} className="aspect-3/4 w-full rounded-control" />
                  <span className="text-xs font-semibold text-heading">Variant {item.number}</span>
                  <span className="-mt-1 text-2xs text-muted">{item.photos.length} ta rasm</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="relative">
              <ProductImage contain src={photoUrl(current, 'large')} className="aspect-3/4 w-full rounded-card [&_svg]:size-10" />
              {slides.length > 1 && (
                <>
                  <SlideArrow side="left" onClick={() => go(-1)} />
                  <SlideArrow side="right" onClick={() => go(1)} />
                </>
              )}
              {current && (
                <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                  Variant {variant.number} · {index + 1}/{slides.length}
                </span>
              )}
            </div>

            {slides.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {slides.map((photo, i) => (
                  <button
                    key={photo.id}
                    ref={i === index ? (node) => node?.scrollIntoView({ block: 'nearest', inline: 'nearest' }) : undefined}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={cn(
                      'w-14 shrink-0 overflow-hidden rounded-control border-2 transition-colors',
                      i === index ? 'border-primary' : 'border-transparent hover:border-border-strong',
                    )}
                  >
                    <ProductImage src={photoUrl(photo, 'small')} className="aspect-3/4 w-full" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ma'lumotlar */}
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <AvailabilityBadges product={product} />
            <div className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5" title="Ko'rishlar">
                <Eye className="size-4" /> {formatCompact(product.views)}
              </span>
              <span className="flex items-center gap-1.5" title="Saqlaganlar">
                <Heart className="size-4" /> {formatCompact(product.in_customers_saved)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {prices.map((price) => (
              <div key={price.label} className="rounded-control bg-hover px-3 py-2.5">
                <p className="text-xs text-muted">{price.label}</p>
                {price.label === 'Sotuv narxi' && discount && price.value ? (
                  <>
                    <p className="mt-0.5 text-sm font-semibold text-heading">{formatPrice(discount.price)}</p>
                    <p className="text-xs text-danger line-through">{price.value}</p>
                  </>
                ) : (
                  <p className="mt-0.5 text-sm font-semibold text-heading">{price.value ?? '—'}</p>
                )}
              </div>
            ))}
          </div>

          <CusDataList
            columns={2}
            items={[
              { label: 'Kategoriya', value: categoryPath(product, tree) || EMPTY },
              {
                label: 'Rang',
                value: color ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 rounded-full border border-border" style={{ background: color.hex_code }} />
                    {color.name}
                  </span>
                ) : (
                  EMPTY
                ),
              },
              { label: "O'lchamlar", value: product.size?.length ? product.size.join(', ') : EMPTY },
              { label: 'Brend', value: product.brand || EMPTY },
              { label: 'Ishlab chiqaruvchi', value: product.manufacture || EMPTY },
              {
                label: 'Saytda rasmlar',
                value: product.blur_image_in_site ? <CusBadge color="warning">Xira</CusBadge> : 'Odatdagidek',
              },
            ]}
          />

          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted">Materiallar</p>
            {productMaterials.length ? (
              <div className="flex flex-wrap gap-1.5">
                {productMaterials.map((material) => (
                  <CusTag key={material.id} size="sm">
                    {material.name}
                  </CusTag>
                ))}
              </div>
            ) : (
              EMPTY
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted">Teglar</p>
            {productTags.length ? (
              <div className="flex flex-wrap gap-1.5">
                {productTags.map((tag) => (
                  <CusTag key={tag.id} size="sm" colorPalette="brand">
                    {tag.name}
                  </CusTag>
                ))}
              </div>
            ) : (
              EMPTY
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted">Tavsif</p>
            {product.description ? (
              <p className="text-sm whitespace-pre-line text-content">{product.description}</p>
            ) : (
              EMPTY
            )}
          </div>

          <CusDataList
            columns={2}
            size="sm"
            items={[
              { label: "Qo'shilgan", value: formatDate(product.created_at) },
              { label: 'Yangilangan', value: formatDate(product.updated_at) },
            ]}
          />
        </div>
      </div>
    </CusDialog>
  )
}
