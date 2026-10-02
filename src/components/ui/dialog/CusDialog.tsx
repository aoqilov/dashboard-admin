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
  /** cover — ekranni chetlaridan kichik joy qoldirib egallaydi (katta formalar, kam scroll) */
  /** Kenglikni qo'lda berish (masalan '1200px'); size dan ustun */
  maxWidth?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'cover' | 'full'
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
  maxWidth,
  size = 'md',
  placement = 'center',
  isPersistent,
  scrollBehavior = 'outside',
}: CusDialogProps) {
  const isCover = size === 'cover'

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
        {/* cover: telefonda chet kichik; juda keng ekranda 1680px dan oshmaydi.
            maxH — "inside" scroll balandlikni 7.5rem ga qisqartirmasin */}
        <Dialog.Positioner p={isCover ? { base: '3', md: '6', xl: '10' } : undefined}>
          <Dialog.Content borderRadius="2xl" maxW={maxWidth ?? (isCover ? '1680px' : undefined)} maxH={isCover ? '100%' : undefined}>
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
