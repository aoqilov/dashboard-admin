import type { ReactNode } from 'react'
import { Alert, CloseButton } from '@chakra-ui/react'

interface CusAlertProps {
  status?: 'info' | 'success' | 'warning' | 'error' | 'neutral'
  title: ReactNode
  description?: ReactNode
  /** subtle — och fon, surface — och fon + chegara, solid — to'liq rang */
  variant?: 'subtle' | 'surface' | 'outline' | 'solid'
  /** O'ng tomondagi tugma (masalan "Batafsil") */
  action?: ReactNode
  onClose?: () => void
  className?: string
}

export function CusAlert({
  status = 'info',
  title,
  description,
  variant = 'surface',
  action,
  onClose,
  className,
}: CusAlertProps) {
  return (
    <Alert.Root status={status} variant={variant} borderRadius="md" alignItems="flex-start" className={className}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title fontWeight="semibold">{title}</Alert.Title>
        {description && <Alert.Description>{description}</Alert.Description>}
      </Alert.Content>
      {action}
      {onClose && <CloseButton size="sm" colorPalette="gray" pos="relative" top="-1" insetEnd="-1" onClick={onClose} />}
    </Alert.Root>
  )
}
