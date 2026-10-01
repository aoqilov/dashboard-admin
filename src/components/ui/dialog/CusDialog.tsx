import type { ReactNode } from 'react'
import { CloseButton, Dialog, Portal } from '@chakra-ui/react'

export interface CusDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Ochuvchi element (tugma). Berilmasa open/onOpenChange bilan boshqariladi */
  trigger?: ReactNode
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  /** Pastki tugmalar */
  footer?: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  placement?: 'center' | 'top'
  /** Tashqariga bosganda yopilmasin */
  isPersistent?: boolean
  /** inside — sarlavha va tugmalar joyida, faqat ichki qism scroll bo'ladi (uzun formalar) */
  scrollBehavior?: 'inside' | 'outside'
}

export function CusDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = 'md',
  placement = 'center',
  isPersistent,
  scrollBehavior = 'outside',
}: CusDialogProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => onOpenChange?.(details.open)}
      size={size}
      placement={placement}
      scrollBehavior={scrollBehavior}
      closeOnInteractOutside={!isPersistent}
      motionPreset="slide-in-bottom"
    >
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl">
            {(title || description) && (
              <Dialog.Header flexDirection="column" alignItems="flex-start" gap="1">
                {title && <Dialog.Title>{title}</Dialog.Title>}
                {description && <Dialog.Description color="fg.muted">{description}</Dialog.Description>}
              </Dialog.Header>
            )}
            {children && <Dialog.Body>{children}</Dialog.Body>}
            {footer && <Dialog.Footer>{footer}</Dialog.Footer>}
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" colorPalette="gray" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
