import { useEffect, useState, type DragEvent } from 'react'
import { AlertCircle, ImagePlus, LoaderCircle, Plus, X } from 'lucide-react'
import { getErrorMessage } from '@/api/api-config/apiError'
import { storeProductPhotos } from '@/api/routes/stores-product-photos/storeProductPhotos.api'
import type { StoreProductPhoto } from '@/api/routes/stores-product-photos/storeProductPhotos.types'
import { cn } from '@/utils/cn'
import { photoUrl } from '@/utils/media'
import { emptyVariant, uid, type PhotoDraft, type VariantDraft } from '../../utils/productForm'
import { FormSection } from './FormSection'

type VariantsUpdater = (updater: (prev: VariantDraft[]) => VariantDraft[]) => void

interface ProductPhotosSectionProps {
  variants: VariantDraft[]
  setVariants: VariantsUpdater
}

/** Server rasmni qayta ishlayotgan bo'lsa shuncha vaqtda qayta so'raladi */
const POLL_MS = 3000

function tileSrc(item: PhotoDraft) {
  if (item.photo?.processing_status === 'ready') return photoUrl(item.photo, 'medium')
  return item.preview ?? photoUrl(item.photo, 'medium')
}

/**
 * Rasmlar: har bir variant — alohida rasm to'plami.
 * Fayl tanlanishi bilan yuklanadi (POST /product-photos), saqlashda faqat id lar yuboriladi.
 */
export function ProductPhotosSection({ variants, setVariants }: ProductPhotosSectionProps) {
  const [activeKey, setActiveKey] = useState(variants[0]?.key)
  const [dragKey, setDragKey] = useState<string | null>(null)
  const [isDropping, setIsDropping] = useState(false)

  const active = variants.find((variant) => variant.key === activeKey) ?? variants[0]

  const patchPhoto = (key: string, patch: Partial<PhotoDraft>) =>
    setVariants((prev) =>
      prev.map((variant) => ({
        ...variant,
        photos: variant.photos.map((item) => (item.key === key ? { ...item, ...patch } : item)),
      })),
    )

  const upload = async (files: File[]) => {
    const images = files.filter((file) => file.type.startsWith('image/'))
    if (!images.length || !active) return

    const drafts = images.map((file) => ({ key: uid(), preview: URL.createObjectURL(file), file }))
    const targetKey = active.key
    setVariants((prev) =>
      prev.map((variant) =>
        variant.key === targetKey
          ? { ...variant, photos: [...variant.photos, ...drafts.map(({ key, preview }) => ({ key, preview }))] }
          : variant,
      ),
    )

    await Promise.all(
      drafts.map(async ({ key, file }) => {
        const body = new FormData()
        body.append('image', file)
        try {
          const photo = await storeProductPhotos.create(body)
          patchPhoto(key, { photo, error: undefined })
        } catch (err) {
          patchPhoto(key, { error: getErrorMessage(err, 'Yuklanmadi') })
        }
      }),
    )
  }

  // Qayta ishlanayotgan (pending) rasmlarni tayyor bo'lguncha kuzatish
  const pendingIds = variants
    .flatMap((variant) => variant.photos)
    .filter((item) => item.photo?.processing_status === 'pending')
    .map((item) => item.photo!.id)
  const pendingKey = pendingIds.join(',')

  useEffect(() => {
    if (!pendingKey) return
    const timer = setTimeout(async () => {
      const ids = pendingKey.split(',').map(Number)
      const results = await Promise.allSettled(ids.map((id) => storeProductPhotos.getOne(id)))
      const fresh = new Map<number, StoreProductPhoto>()
      results.forEach((result) => result.status === 'fulfilled' && fresh.set(result.value.id, result.value))
      setVariants((prev) =>
        prev.map((variant) => ({
          ...variant,
          photos: variant.photos.map((item) =>
            item.photo && fresh.has(item.photo.id) ? { ...item, photo: fresh.get(item.photo.id) } : item,
          ),
        })),
      )
    }, POLL_MS)
    return () => clearTimeout(timer)
  }, [pendingKey, setVariants])

  const removePhoto = (key: string) =>
    setVariants((prev) =>
      prev.map((variant) => ({ ...variant, photos: variant.photos.filter((item) => item.key !== key) })),
    )

  /** Sudrab tartiblash: dragKey ni target oldiga qo'yadi */
  const movePhoto = (targetKey: string) => {
    if (!dragKey || dragKey === targetKey || !active) return
    setVariants((prev) =>
      prev.map((variant) => {
        if (variant.key !== active.key) return variant
        const photos = [...variant.photos]
        const from = photos.findIndex((item) => item.key === dragKey)
        const to = photos.findIndex((item) => item.key === targetKey)
        if (from < 0 || to < 0) return variant
        const [moved] = photos.splice(from, 1)
        photos.splice(to, 0, moved)
        return { ...variant, photos }
      }),
    )
  }

  const addVariant = () => {
    const variant = emptyVariant()
    setVariants((prev) => [...prev, variant])
    setActiveKey(variant.key)
  }

  const removeVariant = (key: string) => {
    const index = variants.findIndex((variant) => variant.key === key)
    setVariants((prev) => prev.filter((variant) => variant.key !== key))
    setActiveKey(variants[index === 0 ? 1 : index - 1]?.key)
  }

  const handleZoneDrop = (event: DragEvent) => {
    event.preventDefault()
    setIsDropping(false)
    if (!dragKey && event.dataTransfer.files.length) upload([...event.dataTransfer.files])
  }

  const isCover = (index: number) => active?.key === variants[0]?.key && index === 0

  return (
    <FormSection
      title="Rasmlar"
      description="Birinchi rasm — muqova. Tartibni sudrab o'zgartiring."
      action={
        <button
          type="button"
          onClick={addVariant}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline dark:text-primary-light"
        >
          <Plus className="size-4" /> Variant
        </button>
      }
    >
      {variants.length > 1 && (
        <div className="-mt-1 flex flex-wrap gap-2">
          {variants.map((variant, index) => {
            const selected = variant.key === active?.key
            return (
              <span
                key={variant.key}
                className={cn(
                  'flex items-center gap-1 rounded-full border py-1 pr-1.5 pl-3 text-xs font-medium transition-colors',
                  selected
                    ? 'border-primary bg-primary/8 text-primary dark:bg-primary/15 dark:text-primary-light'
                    : 'border-border-strong text-content',
                )}
              >
                <button type="button" onClick={() => setActiveKey(variant.key)}>
                  Variant {index + 1} · {variant.photos.length}
                </button>
                <button
                  type="button"
                  aria-label="Variantni o'chirish"
                  onClick={() => removeVariant(variant.key)}
                  className="rounded-full p-0.5 text-muted hover:bg-hover hover:text-danger"
                >
                  <X className="size-3" />
                </button>
              </span>
            )
          })}
        </div>
      )}

      <div
        onDragOver={(event) => {
          event.preventDefault()
          if (!dragKey) setIsDropping(true)
        }}
        onDragLeave={() => setIsDropping(false)}
        onDrop={handleZoneDrop}
        className={cn(
          'grid grid-cols-3 gap-3 rounded-control transition-colors sm:grid-cols-4 xl:grid-cols-5',
          isDropping && 'bg-primary/5 outline-2 outline-offset-4 outline-primary outline-dashed',
        )}
      >
        {active?.photos.map((item, index) => {
          const src = tileSrc(item)
          const uploading = !item.photo && !item.error
          const processing = item.photo?.processing_status === 'pending'
          const failed = Boolean(item.error) || item.photo?.processing_status === 'failed'
          return (
            <div
              key={item.key}
              draggable={Boolean(item.photo)}
              onDragStart={() => setDragKey(item.key)}
              onDragEnd={() => setDragKey(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                if (!dragKey) return
                event.preventDefault()
                event.stopPropagation()
                movePhoto(item.key)
                setDragKey(null)
              }}
              className={cn(
                'group relative aspect-[3/4] cursor-grab overflow-hidden rounded-control bg-hover active:cursor-grabbing',
                dragKey === item.key && 'opacity-40',
                failed && 'ring-2 ring-danger',
              )}
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
              {isCover(index) && !failed && (
                <span className="absolute top-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-2xs font-medium text-white">
                  Muqova
                </span>
              )}
              <button
                type="button"
                aria-label="Rasmni olib tashlash"
                onClick={() => removePhoto(item.key)}
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )
        })}

        <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-control border-2 border-dashed border-border-strong text-center text-muted transition-colors hover:border-primary hover:text-primary">
          <ImagePlus className="size-6" strokeWidth={1.6} />
          <span className="px-2 text-xs font-medium">Rasm qo'shish</span>
          <span className="hidden px-2 text-2xs text-subtle sm:block">yoki shu yerga tashlang</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              upload([...(event.target.files ?? [])])
              event.target.value = ''
            }}
          />
        </label>
      </div>
    </FormSection>
  )
}
