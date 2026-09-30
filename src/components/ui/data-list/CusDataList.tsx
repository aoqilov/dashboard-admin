import type { ReactNode } from 'react'
import { DataList } from '@chakra-ui/react'

export interface DataListEntry {
  label: ReactNode
  value: ReactNode
}

interface CusDataListProps {
  items: DataListEntry[]
  /** vertical — label ustida, qiymat pastda (Profil sahifasidagidek) */
  orientation?: 'horizontal' | 'vertical'
  /** Nechta ustun (vertical uchun) */
  columns?: 1 | 2 | 3 | 4
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

/** "Label: qiymat" juftliklari — Personal Information, Address */
export function CusDataList({
  items,
  orientation = 'vertical',
  columns = 2,
  size = 'md',
  className,
}: CusDataListProps) {
  return (
    <DataList.Root
      orientation={orientation}
      size={size}
      className={orientation === 'vertical' ? `grid gap-x-8 gap-y-6 ${gridColumns[columns]} ${className ?? ''}` : className}
    >
      {items.map((item, index) => (
        <DataList.Item key={index} gap="1.5">
          <DataList.ItemLabel color="fg.muted" fontSize="xs">
            {item.label}
          </DataList.ItemLabel>
          <DataList.ItemValue fontWeight="medium" color="fg">
            {item.value}
          </DataList.ItemValue>
        </DataList.Item>
      ))}
    </DataList.Root>
  )
}
