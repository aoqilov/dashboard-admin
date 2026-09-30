import type { ReactNode } from 'react'
import { Accordion } from '@chakra-ui/react'

export interface AccordionEntry {
  value: string
  title: ReactNode
  content: ReactNode
  icon?: ReactNode
  isDisabled?: boolean
}

interface CusAccordionProps {
  items: AccordionEntry[]
  defaultValue?: string[]
  /** Bir vaqtda bir nechta bo'lim ochiq bo'lishi mumkin */
  multiple?: boolean
  variant?: 'outline' | 'subtle' | 'enclosed' | 'plain'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CusAccordion({
  items,
  defaultValue,
  multiple,
  variant = 'enclosed',
  size = 'md',
  className,
}: CusAccordionProps) {
  return (
    <Accordion.Root
      collapsible
      multiple={multiple}
      defaultValue={defaultValue}
      variant={variant}
      size={size}
      borderRadius="xl"
      className={className}
    >
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value} disabled={item.isDisabled}>
          <Accordion.ItemTrigger fontWeight="medium">
            {item.icon}
            <span className="flex-1 text-left">{item.title}</span>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody color="fg.muted">{item.content}</Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
