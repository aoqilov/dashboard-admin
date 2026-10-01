import type { ReactNode } from 'react'
import { CusCard } from '@/components/shared/card/CusCard'

interface FormSectionProps {
  title: string
  description?: string
  /** Sarlavha yonidagi element (masalan "+ Variant") */
  action?: ReactNode
  children: ReactNode
}

/** Forma bo'limi: sarlavha + qisqa izoh + maydonlar */
export function FormSection({ title, description, action, children }: FormSectionProps) {
  return (
    <CusCard className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-heading">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </CusCard>
  )
}
