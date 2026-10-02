import type { StoreProductPhoto } from '@/api/routes/stores-product-photos/storeProductPhotos.types'
import { MAX_VARIANT_PHOTOS, type PhotoDraft, type VariantDraft } from './productForm'

/**
 * 3-qadam holati: variantlar (katakchalar) + hali hech qaysi variantga qo'yilmagan rasmlar.
 * Rasmlar avval "yuklanganlar"ga tushadi, keyin variantlarga sudrab joylanadi.
 */
export interface PhotoState {
  variants: VariantDraft[]
  pool: PhotoDraft[]
}

/** "Yuklangan rasmlar" joyi. Variant key lari uid() — [0-9a-z], shuning uchun to'qnashmaydi */
export const POOL = '__pool__'

const allPhotos = (state: PhotoState) => [...state.pool, ...state.variants.flatMap((variant) => variant.photos)]

/** Ro'yxatga qo'shish: beforeKey berilsa — o'sha rasm oldiga, aks holda oxiriga */
function insert(list: PhotoDraft[], items: PhotoDraft[], beforeKey?: string) {
  const index = beforeKey ? list.findIndex((item) => item.key === beforeKey) : -1
  return index < 0 ? [...list, ...items] : [...list.slice(0, index), ...items, ...list.slice(index)]
}

/** Variantga yana nechta rasm sig'adi (POOL uchun — cheksiz) */
export function freeSlots(state: PhotoState, slot: string) {
  if (slot === POOL) return Infinity
  const variant = state.variants.find((item) => item.key === slot)
  return Math.max(0, MAX_VARIANT_PHOTOS - (variant?.photos.length ?? 0))
}

/** Rasmlarni joyga (POOL yoki variant key) qo'shish. Variantga sig'magani "yuklangan rasmlar"da qoladi */
export function addPhotos(state: PhotoState, slot: string, items: PhotoDraft[], beforeKey?: string): PhotoState {
  if (slot === POOL) return { ...state, pool: insert(state.pool, items, beforeKey) }
  const room = freeSlots(state, slot)
  const fit = items.slice(0, room)
  const rest = items.slice(room)
  return {
    pool: [...state.pool, ...rest],
    variants: state.variants.map((variant) =>
      variant.key === slot ? { ...variant, photos: insert(variant.photos, fit, beforeKey) } : variant,
    ),
  }
}

export function removePhoto(state: PhotoState, key: string): PhotoState {
  return {
    pool: state.pool.filter((item) => item.key !== key),
    variants: state.variants.map((variant) => ({
      ...variant,
      photos: variant.photos.filter((item) => item.key !== key),
    })),
  }
}

/** Rasmni qayerda bo'lsa ham olib, boshqa joyga (yoki shu joyda boshqa o'ringa) ko'chirish */
export function movePhoto(state: PhotoState, key: string, slot: string, beforeKey?: string): PhotoState {
  const item = allPhotos(state).find((photo) => photo.key === key)
  if (!item || key === beforeKey) return state
  // To'lgan variantga boshqa joydan rasm o'tmaydi (ichida tartiblash mumkin)
  const alreadyThere = state.variants.some((variant) => variant.key === slot && variant.photos.some((p) => p.key === key))
  if (!alreadyThere && freeSlots(state, slot) === 0) return state
  return addPhotos(removePhoto(state, key), slot, [item], beforeKey)
}

/** Yuklash natijasi yoki xatosi — rasm qayerda bo'lsa ham yangilanadi */
export function patchPhoto(state: PhotoState, key: string, patch: Partial<PhotoDraft>): PhotoState {
  const apply = (item: PhotoDraft) => (item.key === key ? { ...item, ...patch } : item)
  return {
    pool: state.pool.map(apply),
    variants: state.variants.map((variant) => ({ ...variant, photos: variant.photos.map(apply) })),
  }
}

/** Serverdan kelgan yangi holat (pending -> ready) */
export function refreshPhotos(state: PhotoState, fresh: Map<number, StoreProductPhoto>): PhotoState {
  const apply = (item: PhotoDraft) =>
    item.photo && fresh.has(item.photo.id) ? { ...item, photo: fresh.get(item.photo.id) } : item
  return {
    pool: state.pool.map(apply),
    variants: state.variants.map((variant) => ({ ...variant, photos: variant.photos.map(apply) })),
  }
}

/** Joylanmagan rasmlarni variantga (sig'qanicha) qo'shish */
export function assignAll(state: PhotoState, variantKey: string): PhotoState {
  const room = freeSlots(state, variantKey)
  const moved = state.pool.slice(0, room)
  return { ...addPhotos(state, variantKey, moved), pool: state.pool.slice(room) }
}

/** Qayta ishlanayotgan rasmlar id lari — kuzatish uchun */
export function pendingPhotoIds(state: PhotoState) {
  return allPhotos(state)
    .filter((item) => item.photo?.processing_status === 'pending')
    .map((item) => item.photo!.id)
}

