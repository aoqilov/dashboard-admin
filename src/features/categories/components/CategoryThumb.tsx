import { ImageOff, LoaderCircle } from 'lucide-react'
import type { StoreCategory } from '@/api/routes/stores-categories/storeCategories.types'
import { cn } from '@/utils/cn'
import { categoryCover } from '../utils/categoryTree'

interface CategoryThumbProps {
  category: StoreCategory
  className?: string
}

/** Kategoriya muqovasi (kvadrat). Qayta ishlanayotgan bo'lsa — aylanuvchi belgi */
export function CategoryThumb({ category, className }: CategoryThumbProps) {
  const src = categoryCover(category)
  const pending = category.cover_processing_status === 'pending'

  return (
    <span
      className={cn(
        'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-control bg-hover text-subtle',
        className,
      )}
    >
      {src ? <img src={src} alt="" className="size-full object-cover" /> : <ImageOff className="size-4" />}
      {pending && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
          <LoaderCircle className="size-4 animate-spin" />
        </span>
      )}
    </span>
  )
}
