import type { ReactNode } from 'react'
import { CusLabel, CusTitle } from '@/components/ui/typography/CusTypography'

interface PageHeaderProps {
  title: string
  description?: ReactNode
  /** O'ng tomondagi tugmalar ("Qo'shish" va h.k.) */
  actions?: ReactNode
}

/** Har bir sahifa tepasidagi sarlavha */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <CusTitle as="h1" size="lg">
          {title}
        </CusTitle>
        {description && <CusLabel className="mt-1">{description}</CusLabel>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}
