import { cn } from '@/utils/cn'
import { SIZE_OPTIONS } from '../../utils/productForm'

interface SizeChipsProps {
  value: number[]
  onChange: (value: number[]) => void
}

/** O'lcham tugmalari (39–45): bir nechtasini tanlash mumkin. Ro'yxatdan tashqari tanlangan o'lchamlar ham ko'rinadi */
export function SizeChips({ value, onChange }: SizeChipsProps) {
  const sizes = [...new Set([...SIZE_OPTIONS, ...value])].sort((a, b) => a - b)

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const selected = value.includes(size)
        return (
          <button
            key={size}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? value.filter((item) => item !== size) : [...value, size].sort((a, b) => a - b))}
            className={cn(
              'h-9 min-w-11 rounded-control border px-3 text-sm font-medium transition-colors',
              selected
                ? 'border-primary bg-primary text-white'
                : 'border-border-strong text-content hover:bg-hover hover:text-heading',
            )}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}
