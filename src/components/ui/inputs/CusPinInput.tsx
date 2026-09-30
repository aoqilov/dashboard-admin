import { PinInput } from '@chakra-ui/react'
import { CusField, type CusFieldProps } from './CusField'

interface CusPinInputProps extends CusFieldProps {
  /** Kataklar soni */
  length?: number
  value?: string
  onChange?: (value: string) => void
  /** Hammasi to'ldirilganda */
  onComplete?: (value: string) => void
  /** SMS kod (one-time-code) */
  otp?: boolean
  /** Raqamlarni yashirish */
  mask?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** Kataklar butun kenglikni egallaydi */
  fullWidth?: boolean
  /** Bo'sh katakdagi belgi (default ○) */
  placeholder?: string
}

export function CusPinInput({
  label,
  helperText,
  errorText,
  isRequired,
  isDisabled,
  isReadOnly,
  className,
  length = 4,
  value,
  onChange,
  onComplete,
  otp,
  mask,
  size = 'lg',
  fullWidth,
  placeholder,
}: CusPinInputProps) {
  return (
    <CusField {...{ label, helperText, errorText, isRequired, isDisabled, isReadOnly, className }}>
      <PinInput.Root
        count={length}
        width={fullWidth ? 'full' : undefined}
        size={size}
        otp={otp}
        mask={mask}
        placeholder={placeholder}
        invalid={Boolean(errorText)}
        value={value === undefined ? undefined : value.split('')}
        onValueChange={(details) => onChange?.(details.valueAsString)}
        onValueComplete={(details) => onComplete?.(details.valueAsString)}
      >
        <PinInput.HiddenInput />
        <PinInput.Control width={fullWidth ? 'full' : undefined}>
          {Array.from({ length }, (_, index) => (
            <PinInput.Input key={index} index={index} flex={fullWidth ? '1' : undefined} />
          ))}
        </PinInput.Control>
      </PinInput.Root>
    </CusField>
  )
}
