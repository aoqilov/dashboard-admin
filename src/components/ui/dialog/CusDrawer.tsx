import type { ReactNode } from 'react'
import { CloseButton, Drawer, Portal } from '@chakra-ui/react'

interface CusDrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
  title?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  /** end — o'ngdan (detal oynalari uchun) */
  placement?: 'start' | 'end' | 'top' | 'bottom'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function CusDrawer({
  open,
  onOpenChange,
  trigger,
  title,
  children,
  footer,
  placement = 'end',
  size = 'md',
}: CusDrawerProps) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={(details) => onOpenChange?.(details.open)}
      placement={placement}
      size={size}
    >
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            {title && (
              <Drawer.Header borderBottomWidth="1px" borderColor="border.muted">
                <Drawer.Title>{title}</Drawer.Title>
              </Drawer.Header>
            )}
            <Drawer.Body py="5">{children}</Drawer.Body>
            {footer && (
              <Drawer.Footer borderTopWidth="1px" borderColor="border.muted">
                {footer}
              </Drawer.Footer>
            )}
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" colorPalette="gray" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
