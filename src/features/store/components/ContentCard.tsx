import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { ProductImage } from '@/features/products/components/shared/ProductBits'

interface ContentCardProps {
  layout: 'grid' | 'list'
  image?: string
  title: string
  description?: string
  /** Belgilar qatori (holat, tur) */
  badges?: ReactNode
  /** Pastki qator: muddat, mahsulotlar */
  meta?: ReactNode
  /** ⋯ menyusi */
  menu: ReactNode
  onClick: () => void
}

/** Chegirma/yangilik kartasi: grid — rasm tepada, list — rasm chapda */
export function ContentCard({ layout, image, title, description, badges, meta, menu, onClick }: ContentCardProps) {
  const isGrid = layout === 'grid'
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => event.key === 'Enter' && onClick()}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-card border border-border bg-surface transition-colors hover:border-border-strong',
        isGrid ? 'flex flex-col' : 'flex items-center gap-4 p-3',
      )}
    >
      <ProductImage src={image} className={isGrid ? 'aspect-video w-full' : 'size-20 rounded-control'} />
      <div className={cn('flex min-w-0 flex-1 flex-col gap-2', isGrid && 'p-4')}>
        <div className="min-w-0 pr-8">
          <p className="truncate text-sm font-medium text-heading">{title}</p>
          {description && <p className="line-clamp-2 text-xs text-subtle">{description}</p>}
        </div>
        {badges && <div className="flex flex-wrap items-center gap-1.5">{badges}</div>}
        {meta && <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">{meta}</div>}
      </div>
      <div
        className={cn('absolute', isGrid ? 'right-2 top-2 rounded-control bg-surface/90' : 'right-3 top-3')}
        onClick={(event) => event.stopPropagation()}
      >
        {menu}
      </div>
    </div>
  )
}
