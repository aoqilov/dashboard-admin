import type { ReactNode } from 'react'
import { SegmentGroup } from '@chakra-ui/react'

interface CusSegmentProps {
  items: { value: string; label: ReactNode; isDisabled?: boolean }[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

/** Kun / Hafta / Oy kabi almashtirgich */
export function CusSegment({ items, value, defaultValue, onChange, size = 'md', className }: CusSegmentProps) {
  return (
    <SegmentGroup.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={(details) => onChange?.(details.value ?? '')}
      size={size}
      className={className}
    >
      <SegmentGroup.Indicator />
      <SegmentGroup.Items
        items={items.map((item) => ({ value: item.value, label: item.label, disabled: item.isDisabled }))}
      />
    </SegmentGroup.Root>
  )
}
