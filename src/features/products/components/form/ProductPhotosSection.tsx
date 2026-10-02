import { useEffect, useState, type DragEvent, type HTMLAttributes } from 'react'
import { AlertCircle, ImagePlus, LoaderCircle, X } from 'lucide-react'
import { storeProductPhotos } from '@/api/routes/stores-product-photos/storeProductPhotos.api'
import type { StoreProductPhoto } from '@/api/routes/stores-product-photos/storeProductPhotos.types'
import { cn } from '@/utils/cn'
import { photoUrl } from '@/utils/media'
import { FORM_COLUMN, FORM_COLUMNS } from '../../utils/formLayout'
import {
  addPhotos,
  assignAll,
  freeSlots,
  movePhoto,
  pendingPhotoIds,
  POOL,
  refreshPhotos,
  removePhoto,
  type PhotoState,
} from '../../utils/photoState'
import { MAX_VARIANT_PHOTOS, uid, type PhotoDraft, type VariantDraft } from '../../utils/productForm'
import { FormSection } from './FormSection'

interface ProductPhotosSectionProps {
  variants: VariantDraft[]
  pool: PhotoDraft[]
  /** Joylanmagan rasmlar haqida xato (saqlashda) */
  error?: string
  onChange: (updater: (prev: PhotoState) => PhotoState) => void
}

/** Server rasmni qayta ishlayotgan bo'lsa shuncha vaqtda qayta so'raladi */
const POLL_MS = 3000

function tileSrc(item: PhotoDraft) {
  if (item.photo?.processing_status === 'ready') return photoUrl(item.photo, 'medium')
  return item.preview ?? photoUrl(item.photo, 'medium')
}

interface PhotoTileProps extends HTMLAttributes<HTMLDivElement> {
  item: PhotoDraft
  isCover?: boolean
  isDragging?: boolean
  onRemove: () => void
}

/** Bitta rasm: yuklanish/tayyorlanish holati, muqova belgisi, olib tashlash */
function PhotoTile({ item, isCover, isDragging, onRemove, className, ...props }: PhotoTileProps) {
  const src = tileSrc(item)
  const uploading = Boolean(item.uploading)
  const processing = item.photo?.processing_status === 'pending'
  const failed = Boolean(item.error) || item.photo?.processing_status === 'failed'

  return (
    <div
      draggable
      className={cn(
        'group relative aspect-3/4 cursor-grab overflow-hidden rounded-control bg-hover active:cursor-grabbing',
        isDragging && 'opacity-40',
        failed && 'ring-2 ring-danger',
        className,
      )}
      {...props}
    >
      {src && <img src={src} alt="" className="size-full object-cover" draggable={false} />}

      {(uploading || processing) && (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/45 text-2xs text-white">
          <LoaderCircle className="size-5 animate-spin" />
          {uploading ? 'Yuklanmoqda' : 'Tayyorlanmoqda'}
        </span>
      )}
      {failed && (
        <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-danger px-2 py-1 text-2xs text-white">
          <AlertCircle className="size-3 shrink-0" />
          <span className="truncate">{item.error ?? 'Qayta ishlanmadi'}</span>
        </span>
      )}
      {isCover && !failed && (
        <span className="absolute top-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-2xs font-medium text-white">
          Muqova
        </span>
      )}
      <button
        type="button"
        aria-label="Rasmni olib tashlash"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}

/**
 * 3-qadam. O'ngda — rasmlar tanlanadi ("tanlangan rasmlar"),
 * chapda — variantlar: rasmlar o'ngdan kerakli variantga sudrab joylanadi.
 * Variant ichida sudrab tartiblanadi; birinchi variantning birinchi rasmi — muqova.
 * Fayllar tanlanganda serverga yuklanmaydi: "Saqlash" bosilganda faqat variantlarga qo'yilganlari
 * yuklanadi (POST /product-photos), mahsulot esa shu id lar bilan saqlanadi.
 */
export function ProductPhotosSection({ variants, pool, error, onChange }: ProductPhotosSectionProps) {
  /** Sudralayotgan rasm (ichki). null bo'lsa — kompyuterdan fayl tashlanmoqda */
  const [dragKey, setDragKey] = useState<string | null>(null)
  /** Ustida turgan joy: POOL yoki variant key */
  const [overSlot, setOverSlot] = useState<string | null>(null)

  /** Fayllar faqat ro'yxatga qo'shiladi; serverga "Saqlash" paytida, faqat variantdagilari yuklanadi */
  const addFiles = (files: File[], slot: string) => {
    const drafts = files
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({ key: uid(), file, preview: URL.createObjectURL(file) }))
    if (drafts.length) onChange((prev) => addPhotos(prev, slot, drafts))
  }

  // Qayta ishlanayotgan (pending) rasmlarni tayyor bo'lguncha kuzatish
  const pendingKey = pendingPhotoIds({ variants, pool }).join(',')

  useEffect(() => {
    if (!pendingKey) return
    const timer = setTimeout(async () => {
      const ids = pendingKey.split(',').map(Number)
      const results = await Promise.allSettled(ids.map((id) => storeProductPhotos.getOne(id)))
      const fresh = new Map<number, StoreProductPhoto>()
      results.forEach((result) => result.status === 'fulfilled' && fresh.set(result.value.id, result.value))
      onChange((prev) => refreshPhotos(prev, fresh))
    }, POLL_MS)
    return () => clearTimeout(timer)
  }, [pendingKey, onChange])

  const endDrag = () => {
    setDragKey(null)
    setOverSlot(null)
  }

  /** Tashlash: ichki rasm — ko'chiriladi, kompyuterdan fayl — shu joyga yuklanadi */
  const handleDrop = (event: DragEvent, slot: string, beforeKey?: string) => {
    event.preventDefault()
    event.stopPropagation()
    if (dragKey) onChange((prev) => movePhoto(prev, dragKey, slot, beforeKey))
    else if (event.dataTransfer.files.length) addFiles([...event.dataTransfer.files], slot)
    endDrag()
  }

  /** Joy (variant katagi yoki "yuklanganlar") — tashlash nishoni */
  const slotTarget = (slot: string) => ({
    onDragOver: (event: DragEvent) => {
      event.preventDefault()
      if (overSlot !== slot) setOverSlot(slot)
    },
    onDragLeave: (event: DragEvent) => {
      // Ichki elementga o'tganda emas, joydan butunlay chiqqanda
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setOverSlot((prev) => (prev === slot ? null : prev))
      }
    },
    onDrop: (event: DragEvent) => handleDrop(event, slot),
  })

  /** Rasm: sudraladi; variant ichida — ustiga tashlansa shu rasm oldiga qo'yiladi */
  const tileProps = (item: PhotoDraft, slot: string) => ({
    item,
    isDragging: dragKey === item.key,
    onRemove: () => onChange((prev) => removePhoto(prev, item.key)),
    onDragStart: (event: DragEvent) => {
      event.dataTransfer.effectAllowed = 'move'
      // Firefox sudrashni boshlashi uchun ma'lumot kerak
      event.dataTransfer.setData('text/plain', item.key)
      setDragKey(item.key)
    },
    onDragEnd: endDrag,
    ...(slot !== POOL && { onDrop: (event: DragEvent) => handleDrop(event, slot, item.key) }),
  })

  return (
    <div className={FORM_COLUMNS}>
      {/* Chap: variantlar (katakchalar) */}
      <div className={FORM_COLUMN}>
        <FormSection
          title="Variantlar"
          description={"Rasmlarni o'ngdan kerakli variantga sudrang. Har bir variantga " + MAX_VARIANT_PHOTOS + " tagacha rasm. Bo'sh variantlar saqlanmaydi."}
        >
          <div className="flex flex-col gap-3">
            {variants.map((variant, index) => (
              <div
                key={variant.key}
                {...slotTarget(variant.key)}
                className={cn(
                  'flex flex-col gap-3 rounded-card border-2 border-dashed p-3 transition-colors',
                  overSlot === variant.key ? 'border-primary bg-primary/5' : 'border-border-strong',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-heading">
                    Variant {index + 1}
                    <span className="font-normal text-muted"> · {variant.photos.length}/{MAX_VARIANT_PHOTOS} rasm</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {pool.length > 0 && freeSlots({ variants, pool }, variant.key) > 0 && (
                      <button
                        type="button"
                        onClick={() => onChange((prev) => assignAll(prev, variant.key))}
                        className="text-xs font-medium text-primary hover:underline dark:text-primary-light"
                      >
                        Hammasini qo'shish ({Math.min(pool.length, freeSlots({ variants, pool }, variant.key))})
                      </button>
                    )}
                  </div>
                </div>

                {variant.photos.length === 0 ? (
                  <p className="py-8 text-center text-xs text-subtle">Rasmlarni shu yerga sudrang</p>
                ) : (
                  <div className="grid grid-cols-5 gap-2">
                    {variant.photos.map((item, photoIndex) => (
                      <PhotoTile
                        key={item.key}
                        isCover={index === 0 && photoIndex === 0}
                        {...tileProps(item, variant.key)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FormSection>
      </div>

      {/* O'ng: yuklangan, hali joylanmagan rasmlar. Telefonda — birinchi */}
      <div className={cn(FORM_COLUMN, 'order-first lg:order-0')}>
        <FormSection
          title="Tanlangan rasmlar"
          description="Rasmlarni tanlang va variantlarga sudrab joylang. Faqat variantga qo'yilganlari saqlanadi"
        >
          <div {...slotTarget(POOL)} className="flex flex-col gap-4">
            <label
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-card border-2 border-dashed px-4 py-8 text-center transition-colors',
                overSlot === POOL
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border-strong text-muted hover:border-primary hover:text-primary',
              )}
            >
              <ImagePlus className="size-7" strokeWidth={1.6} />
              <span className="text-sm font-medium">Rasmlarni tanlang yoki shu yerga tashlang</span>
              <span className="text-xs text-subtle">Bir nechtasini birdan tanlash mumkin</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => {
                  addFiles([...(event.target.files ?? [])], POOL)
                  event.target.value = ''
                }}
              />
            </label>

            {error && (
              <p className="flex items-center gap-1.5 text-sm text-danger">
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </p>
            )}

            {pool.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {pool.map((item) => (
                  <PhotoTile key={item.key} {...tileProps(item, POOL)} />
                ))}
              </div>
            ) : (
              <p className="text-center text-xs text-subtle">
                Joylanmagan rasm yo'q. Variantdagi rasmni shu yerga sudrasangiz, variantdan chiqadi (saqlanmaydi).
              </p>
            )}
          </div>
        </FormSection>
      </div>
    </div>
  )
}
