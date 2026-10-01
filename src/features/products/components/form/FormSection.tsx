import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  description?: string
  /** Sarlavha yonidagi element (masalan "+ Variant") */
  action?: ReactNode
  children: ReactNode
}

/** Modal ichidagi forma bo'limi: sarlavha + qisqa izoh + maydonlar. Bo'limlar orasida chiziq */
export function FormSection({ title, description, action, children }: FormSectionProps) {
  return (
    <section className="flex flex-col gap-5 py-6 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-heading">{title}</h3>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
