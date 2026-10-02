import type { ContentStatus } from '@/api/common.types'
import type { ColorVariant } from '@/theme/tokens'
import { formatDate } from './format'

/** Yangilik va chegirma holatlari: navbat kutmoqda → faol → arxiv */
export const SCHEDULE_STATUS: Record<ContentStatus, { label: string; color: ColorVariant }> = {
  draft: { label: 'Navbat kutmoqda', color: 'warning' },
  active: { label: 'Faol', color: 'success' },
  archived: { label: 'Arxiv', color: 'dark' },
}

interface Scheduled {
  starts_at?: string | null
  ends_at?: string | null
  status?: ContentStatus
}

/**
 * Holat muddatdan kelib chiqadi: boshlanishi kelmagan — draft (navbat kutmoqda),
 * muddat ichida — active, tugagan — archived. Muddat berilmagan bo'lsa — saqlangan status.
 */
export function scheduleStatus(item: Scheduled, now = new Date()): ContentStatus {
  const start = item.starts_at ? new Date(item.starts_at) : null
  const end = item.ends_at ? new Date(item.ends_at) : null
  if (!start && !end) return item.status ?? 'draft'
  if (start && now < start) return 'draft'
  if (end && now > end) return 'archived'
  return 'active'
}

const RANK: Record<ContentStatus, number> = { active: 0, draft: 1, archived: 2 }

/** Tartib: avval faollar (tez tugaydigani birinchi), keyin navbat (tez boshlanadigani), oxirida arxiv (yangisi birinchi) */
export function sortBySchedule<T extends Scheduled & { phase: ContentStatus }>(items: T[]) {
  const time = (value?: string | null) => (value ? new Date(value).getTime() : 0)
  return [...items].sort((a, b) => {
    if (a.phase !== b.phase) return RANK[a.phase] - RANK[b.phase]
    if (a.phase === 'active') return time(a.ends_at) - time(b.ends_at)
    if (a.phase === 'draft') return time(a.starts_at) - time(b.starts_at)
    return time(b.ends_at) - time(a.ends_at)
  })
}

/** '2026-10-03' -> kun boshi (mahalliy vaqt) ISO ko'rinishida */
export const dateToIsoStart = (date: string) => new Date(`${date}T00:00:00`).toISOString()

/** '2026-10-03' -> kun oxiri (23:59:59, mahalliy vaqt) ISO ko'rinishida */
export const dateToIsoEnd = (date: string) => new Date(`${date}T23:59:59`).toISOString()

/** ISO -> date input uchun '2026-10-03' (mahalliy kun). Bo'sh bo'lsa '' */
export function isoToDateInput(iso?: string | null) {
  if (!iso) return ''
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** "03.10.2026 – 10.10.2026" */
export function formatPeriod(start?: string | null, end?: string | null) {
  if (!start && !end) return '—'
  return `${start ? formatDate(start) : '…'} – ${end ? formatDate(end) : '…'}`
}
