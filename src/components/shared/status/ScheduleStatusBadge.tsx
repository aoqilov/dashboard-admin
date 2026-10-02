import type { ContentStatus } from '@/api/common.types'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { SCHEDULE_STATUS } from '@/utils/schedule'

/** Navbat kutmoqda / Faol / Arxiv belgisi */
export function ScheduleStatusBadge({ status }: { status: ContentStatus }) {
  const { label, color } = SCHEDULE_STATUS[status]
  return <CusBadge color={color}>{label}</CusBadge>
}
