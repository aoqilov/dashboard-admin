import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import type { DiscountType, StoreDiscount } from '@/api/routes/stores-discounts/storeDiscounts.types'
import { scheduleStatus } from '@/utils/schedule'

/** Mahsulotga qo'llanadigan chegirma: foiz yoki so'mdagi summa */
export interface DiscountRule {
  type: DiscountType
  value: number
}

export const DISCOUNT_TYPES: { value: DiscountType; label: string }[] = [
  { value: 'percentage', label: 'Foiz (%)' },
  { value: 'fixed_amount', label: "Summa (so'm)" },
]

/** Inputdagi "1 500,5" -> 1500.5 */
export const parseDiscountValue = (value: string) => Number(value.replace(/s/g, '').replace(',', '.'))

/** Chegirmadan keyingi narx (0 dan past bo'lmaydi) */
export function applyDiscount(price: number, rule: DiscountRule) {
  const off = rule.type === 'percentage' ? (price * rule.value) / 100 : rule.value
  return Math.max(0, Math.round((price - off) * 100) / 100)
}

/** Bir nechta chegirma bo'lsa — narxni eng ko'p tushiradigani */
export function bestDiscount(price: number, rules: DiscountRule[] | undefined) {
  if (!rules?.length) return undefined
  const best = rules.reduce((a, b) => (applyDiscount(price, b) < applyDiscount(price, a) ? b : a))
  return { rule: best, price: applyDiscount(price, best) }
}

/** "15%" yoki "20 000 so'm" */
export function formatRule(rule: DiscountRule) {
  return rule.type === 'percentage' ? `${rule.value}%` : `${rule.value.toLocaleString('ru-RU')} so'm`
}

/** Hozir amalda bo'lgan (faol) chegirmalardan: mahsulot id -> qoidalar */
export function activeRuleMap(discounts: StoreDiscount[]) {
  const map = new Map<number, DiscountRule[]>()
  for (const discount of discounts) {
    if (scheduleStatus(discount) !== 'active') continue
    for (const item of discount.products ?? []) {
      const list = map.get(item.product) ?? []
      list.push({ type: item.discount_type, value: Number(item.value) })
      map.set(item.product, list)
    }
  }
  return map
}

/** Faol chegirmadan keyingi sotuv narxi (chegirma bo'lmasa undefined) */
export function saleDiscount(product: StoreProduct, rules: DiscountRule[] | undefined) {
  if (!product.is_sellable || !product.price_sale) return undefined
  return bestDiscount(Number(product.price_sale), rules)
}
