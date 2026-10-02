import { useSyncExternalStore } from 'react'
import type { NewsType } from '@/api/routes/stores-news/storeNews.types'

export interface NewsFormValues {
  title: string
  news_type: NewsType | ''
  slug: string
  description: string
  /** ISO kun: '2026-10-03' */
  starts: string
  ends: string
  /** Tanlangan mahsulot id lari */
  products: number[]
  /** Yangi tanlangan rasm fayli */
  image: File | null
}

/** Mahsulotlar sahifasiga o'tib ketganda forma yo'qolmasligi uchun saqlanadigan qoralama */
export interface NewsDraft extends NewsFormValues {
  /** Tahrirlanayotgan yangilik id si (yangi bo'lsa null) */
  itemId: number | null
  slugLocked: boolean
  /** "Bekor qilish" bosilganda qaytariladigan mahsulotlar */
  originalProducts: number[]
}

interface DraftState {
  draft: NewsDraft | null
  /** true — /products da "yangilik uchun tanlash" rejimi yoqilgan */
  picking: boolean
}

let state: DraftState = { draft: null, picking: false }
const listeners = new Set<() => void>()

function emit(next: DraftState) {
  state = next
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Joriy qoralama va tanlash rejimi (sahifalar orasida saqlanadi) */
export function useNewsDraft() {
  return useSyncExternalStore(subscribe, () => state)
}

/** Formani qoralamaga saqlab, mahsulot tanlash rejimini yoqadi */
export function startNewsPicking(itemId: number | null, values: NewsFormValues, slugLocked: boolean) {
  emit({ draft: { ...values, itemId, slugLocked, originalProducts: values.products }, picking: true })
}

export function setDraftProducts(products: number[]) {
  if (state.draft) emit({ ...state, draft: { ...state.draft, products } })
}

/** "Tayyor": rejim o'chadi, qoralama forma qayta ochilishi uchun qoladi */
export function finishNewsPicking() {
  emit({ ...state, picking: false })
}

/** "Bekor qilish": tanlov rejimdan oldingi holatga qaytadi, forma qayta ochiladi */
export function cancelNewsPicking() {
  if (state.draft) emit({ draft: { ...state.draft, products: state.draft.originalProducts }, picking: false })
}

export function clearNewsDraft() {
  emit({ draft: null, picking: false })
}
