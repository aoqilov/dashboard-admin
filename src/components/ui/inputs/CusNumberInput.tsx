import { NumberInput } from '@chakra-ui/react'
import { CusField, type CusFieldProps } from './CusField'

interface CusNumberInputProps extends CusFieldProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  /** Intl formatlash, masalan { style: 'currency', currency: 'USD' } */
  formatOptions?: Intl.NumberFormatOptions
}

export function CusNumberInput({
  label,
  helperText,
  errorText,
  isRequired,
  isDisabled,
  isReadOnly,
  className,
  value,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  size = 'lg',
  formatOptions,
}: CusNumberInputProps) {
  return (
    <CusField {...{ label, helperText, errorText, isRequired, isDisabled, isReadOnly, className }}>
      <NumberInput.Root
        width="full"
        size={size}
        value={value === undefined ? undefined : String(value)}
        defaultValue={defaultValue === undefined ? undefined : String(defaultValue)}
        onValueChange={(details) => onChange?.(details.valueAsNumber)}
        min={min}
        max={max}
        step={step}
        formatOptions={formatOptions}
      >
        <NumberInput.Control />
        <NumberInput.Input placeholder={placeholder} />
      </NumberInput.Root>
    </CusField>
  )
}
