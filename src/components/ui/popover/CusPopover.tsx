import type { ReactNode } from 'react'
import { Popover, Portal } from '@chakra-ui/react'

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'

interface CusPopoverProps {
  trigger: ReactNode
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  placement?: Placement
  showArrow?: boolean
  width?: string
}

/** Bosilganda ochiladigan kichik panel (filtr, qo'shimcha amallar) */
export function CusPopover({
  trigger,
  title,
  children,
  footer,
  open,
  onOpenChange,
  placement = 'bottom',
  showArrow = true,
  width = '72',
}: CusPopoverProps) {
  return (
    <Popover.Root
      open={open}
      onOpenChange={(details) => onOpenChange?.(details.open)}
      positioning={{ placement }}
    >
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content width={width} borderRadius="xl">
            {showArrow && (
              <Popover.Arrow>
                <Popover.ArrowTip />
              </Popover.Arrow>
            )}
            <Popover.Body display="flex" flexDirection="column" gap="2">
              {title && <Popover.Title fontWeight="semibold">{title}</Popover.Title>}
              {children}
            </Popover.Body>
            {footer && <Popover.Footer>{footer}</Popover.Footer>}
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}
