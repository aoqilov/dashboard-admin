import type { ReactNode } from 'react'
import { Switch } from '@chakra-ui/react'

interface CusSwitchProps {
  children?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  className?: string
}

export function CusSwitch({
  children,
  checked,
  defaultChecked,
  onChange,
  size = 'md',
  isDisabled,
  className,
}: CusSwitchProps) {
  return (
    <Switch.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(details) => onChange?.(details.checked)}
      size={size}
      disabled={isDisabled}
      className={className}
    >
      <Switch.HiddenInput />
      <Switch.Control />
      {children && <Switch.Label>{children}</Switch.Label>}
    </Switch.Root>
  )
}
