import type { ReactNode } from 'react'
import { Tabs } from '@chakra-ui/react'

export interface TabItem {
  value: string
  label: ReactNode
  icon?: ReactNode
  content?: ReactNode
  isDisabled?: boolean
}

interface CusTabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** line — pastki chiziq, subtle — och fon, enclosed — guruhlangan tugmalar */
  variant?: 'line' | 'subtle' | 'enclosed' | 'outline' | 'plain'
  size?: 'sm' | 'md' | 'lg'
  fitted?: boolean
  className?: string
}

export function CusTabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = 'line',
  size = 'md',
  fitted,
  className,
}: CusTabsProps) {
  return (
    <Tabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={(details) => onChange?.(details.value)}
      variant={variant}
      size={size}
      fitted={fitted}
      className={className}
    >
      <Tabs.List>
        {items.map((item) => (
          <Tabs.Trigger key={item.value} value={item.value} disabled={item.isDisabled}>
            {item.icon}
            {item.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {items.map(
        (item) =>
          item.content !== undefined && (
            <Tabs.Content key={item.value} value={item.value}>
              {item.content}
            </Tabs.Content>
          ),
      )}
    </Tabs.Root>
  )
}
