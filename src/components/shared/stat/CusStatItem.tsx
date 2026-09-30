import type { LucideIcon } from 'lucide-react'
import { CusIconBadge } from '@/components/ui/badge/CusIconBadge'
import { CusLabel, CusValue } from '@/components/ui/typography/CusTypography'
import type { ColorVariant } from '@/theme/tokens'

interface CusStatItemProps {
  icon: LucideIcon
  label: string
  value: string | number
  color?: ColorVariant
}

/** Ikonka + nom + katta raqam */
export function CusStatItem({ icon, label, value, color = 'primary' }: CusStatItemProps) {
  return (
    <div className="flex items-center gap-4">
      <CusIconBadge icon={icon} color={color} size="lg" />
      <div>
        <CusLabel>{label}</CusLabel>
        <CusValue color={color} className="mt-1">
          {value}
        </CusValue>
      </div>
    </div>
  )
}
