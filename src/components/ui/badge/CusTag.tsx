import type { ReactNode } from 'react'
import { Tag } from '@chakra-ui/react'

type Palette = 'brand' | 'gray' | 'green' | 'red' | 'orange' | 'blue'

interface CusTagProps {
  children: ReactNode
  icon?: ReactNode
  /** Berilsa ✕ tugmasi chiqadi */
  onClose?: () => void
  colorPalette?: Palette
  variant?: 'subtle' | 'solid' | 'outline' | 'surface'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
}

/** Olib tashlanadigan teg (filtrlar, tanlangan elementlar) */
export function CusTag({
  children,
  icon,
  onClose,
  colorPalette = 'gray',
  variant = 'surface',
  size = 'md',
  rounded,
}: CusTagProps) {
  return (
    <Tag.Root colorPalette={colorPalette} variant={variant} size={size} borderRadius={rounded ? 'full' : undefined}>
      {icon && <Tag.StartElement>{icon}</Tag.StartElement>}
      <Tag.Label>{children}</Tag.Label>
      {onClose && (
        <Tag.EndElement>
          <Tag.CloseTrigger onClick={onClose} />
        </Tag.EndElement>
      )}
    </Tag.Root>
  )
}
