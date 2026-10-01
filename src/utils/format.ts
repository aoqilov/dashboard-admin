/** "1450000.00" -> "1 450 000 so'm". Bo'sh bo'lsa null */
export function formatPrice(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return null
  const number = Number(value)
  if (!Number.isFinite(number)) return null
  return `${number.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} so'm`
}

/** "2026-09-30T20:03:40Z" -> "30.09.2026" */
export function formatDate(value: string | null | undefined) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('ru-RU')
}

/** 1250 -> "1,2K" */
export function formatCompact(value: number) {
  return Intl.NumberFormat('ru-RU', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}
