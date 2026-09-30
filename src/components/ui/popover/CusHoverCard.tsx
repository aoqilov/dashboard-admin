import type { ReactNode } from 'react'
import { HoverCard, Portal } from '@chakra-ui/react'

interface CusHoverCardProps {
  trigger: ReactNode
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  openDelay?: number
}

/** Sichqoncha ustiga borganda chiqadigan karta (foydalanuvchi profili va h.k.) */
export function CusHoverCard({ trigger, children, placement = 'bottom', openDelay = 300 }: CusHoverCardProps) {
  return (
    <HoverCard.Root openDelay={openDelay} positioning={{ placement }}>
      <HoverCard.Trigger asChild>{trigger}</HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content borderRadius="xl">
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
            {children}
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
}
