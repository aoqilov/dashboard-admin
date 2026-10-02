import type { OrderStatus, StoreOrder } from '@/api/routes/stores-orders/storeOrders.types'
import { COLORS } from '@/config/charts'
import { isoToDateInput } from '@/utils/schedule'

/** Hisobot davri (kunlarda) */
export const PERIODS = [
  { value: '7', label: '7 kun' },
  { value: '30', label: '30 kun' },
  { value: '90', label: '90 kun' },
]

const pad = (n: number) => String(n).padStart(2, '0')

const toKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** Oxirgi N kun (bugun ham), eskisidan yangisiga: ['2026-09-27', ..., '2026-10-03'] */
export function lastDays(days: number) {
  const today = new Date()
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (days - 1 - i))
    return toKey(date)
  })
}

/** Davr boshi: '2026-09-27' */
export const periodStart = (days: number) => lastDays(days)[0]

/** Buyurtma holatlari: nomi va grafik rangi (tartib — grafikdagi tartib) */
export const ORDER_STATUSES: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending_confirmation', label: 'Tasdiq kutmoqda', color: COLORS.warning },
  { value: 'confirmed', label: 'Tasdiqlangan', color: COLORS.info },
  { value: 'delivered', label: 'Yetkazilgan', color: COLORS.success },
  { value: 'closed', label: 'Yopilgan', color: '#6c757d' },
  { value: 'cancelled', label: 'Bekor qilingan', color: COLORS.danger },
  { value: 'returned', label: 'Qaytarilgan', color: '#fd7e14' },
]

/** Buyurtma summasi: qatorlar yakuniy narxi × soni */
export const orderTotal = (order: StoreOrder) =>
  order.items.reduce((sum, item) => sum + Number(item.final_price) * item.quantity, 0)

/** Tushumga kirmaydigan buyurtmalar */
export const isLostOrder = (order: StoreOrder) => order.status === 'cancelled' || order.status === 'returned'

/** Buyurtmalarni kunlar bo'yicha: soni va summasi (bekor/qaytarilganlar summaga kirmaydi) */
export function ordersByDay(orders: StoreOrder[], days: string[]) {
  const map = new Map(days.map((day) => [day, { count: 0, sum: 0 }]))
  for (const order of orders) {
    const entry = map.get(isoToDateInput(order.created_at))
    if (!entry) continue
    entry.count += 1
    if (!isLostOrder(order)) entry.sum += orderTotal(order)
  }
  return days.map((day) => ({ day, ...map.get(day)! }))
}

/** "2026-10-03" -> "03.10" */
export const shortDay = (day: string) => `${day.slice(8, 10)}.${day.slice(5, 7)}`

/** Tugashigacha necha kun qoldi (bugun tugasa — 0, o'tgan bo'lsa — manfiy) */
export function daysLeft(endsAt?: string | null) {
  if (!endsAt) return null
  return Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86_400_000)
}
