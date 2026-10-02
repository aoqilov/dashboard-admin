import { useSyncExternalStore } from 'react'
import type { DiscountType } from '@/api/routes/stores-discounts/storeDiscounts.types'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'

/** Chegirmadagi tanlangan mahsulot (inputlar satr bilan ishlaydi) */
export interface DiscountRow {
  /** Mahsulot id si */
  product: string
  type: DiscountType
  value: string
}

export interface DiscountFormValues {
  title: string
  description: string
  /** ISO kun: '2026-10-03' */
  starts: string
  ends: string
  /** Yangi tanlangan rasm fayli */
  image: File | null
  rows: DiscountRow[]
}

/** Mahsulotlar sahifasiga o'tib ketganda forma yo'qolmasligi uchun saqlanadigan qoralama */
export interface DiscountDraft extends DiscountFormValues {
  /** Tahrirlanayotgan chegirma id si (yangi bo'lsa null) */
  itemId: number | null
  /** "Bekor qilish" bosilganda qaytariladigan qatorlar */
  originalRows: DiscountRow[]
}

interface DraftState {
  draft: DiscountDraft | null
  /** true — /products da "chegirma uchun tanlash" rejimi yoqilgan */
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
export function useDiscountDraft() {
  return useSyncExternalStore(subscribe, () => state)
}

/** Formani qoralamaga saqlab, mahsulot tanlash rejimini yoqadi */
export function startPicking(itemId: number | null, values: DiscountFormValues) {
  emit({ draft: { ...values, itemId, originalRows: values.rows }, picking: true })
}

export function setDraftRows(rows: DiscountRow[]) {
  if (state.draft) emit({ ...state, draft: { ...state.draft, rows } })
}

/** "Tayyor": rejim o'chadi, qoralama forma qayta ochilishi uchun qoladi */
export function finishPicking() {
  emit({ ...state, picking: false })
}

/** "Bekor qilish": tanlov rejimdan oldingi holatga qaytadi, forma qayta ochiladi */
export function cancelPicking() {
  if (state.draft) emit({ draft: { ...state.draft, rows: state.draft.originalRows }, picking: false })
}

export function clearDraft() {
  emit({ draft: null, picking: false })
}

/** Mahsulotni tanlash/bekor qilish. Yangi qator oxirgi qatorning turi va qiymatini oladi — ko'p mahsulotga bir xil chegirma tez qo'yiladi */
export function toggleRow(rows: DiscountRow[], product: StoreProduct): DiscountRow[] {
  const id = String(product.id)
  if (rows.some((row) => row.product === id)) return rows.filter((row) => row.product !== id)
  const last = rows.at(-1)
  return [...rows, { product: id, type: last?.type ?? 'percentage', value: last?.value ?? '' }]
}
