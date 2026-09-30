import type { ReactNode } from 'react'
import { Portal, Tooltip } from '@chakra-ui/react'

interface CusTooltipProps {
  content: ReactNode
  children: ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  showArrow?: boolean
  openDelay?: number
  isDisabled?: boolean
}

export function CusTooltip({
  content,
  children,
  placement = 'top',
  showArrow = true,
  openDelay = 200,
  isDisabled,
}: CusTooltipProps) {
  if (isDisabled) return <>{children}</>

  return (
    <Tooltip.Root openDelay={openDelay} closeDelay={100} positioning={{ placement }}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>
            {showArrow && (
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
            )}
            {content}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  )
}
