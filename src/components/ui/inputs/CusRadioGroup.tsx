import type { ReactNode } from 'react'
import { RadioGroup } from '@chakra-ui/react'

interface CusRadioGroupProps {
  options: { label: ReactNode; value: string; isDisabled?: boolean }[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  direction?: 'row' | 'column'
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  className?: string
}

export function CusRadioGroup({
  options,
  value,
  defaultValue,
  onChange,
  direction = 'row',
  size = 'md',
  isDisabled,
  className,
}: CusRadioGroupProps) {
  return (
    <RadioGroup.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(details) => onChange?.(details.value ?? '')}
      size={size}
      disabled={isDisabled}
      className={className}
    >
      <div className={direction === 'row' ? 'flex flex-wrap gap-6' : 'flex flex-col gap-3'}>
        {options.map((option) => (
          <RadioGroup.Item key={option.value} value={option.value} disabled={option.isDisabled}>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>{option.label}</RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </div>
    </RadioGroup.Root>
  )
}
