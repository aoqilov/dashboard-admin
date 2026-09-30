import { NativeSelect } from '@chakra-ui/react'
import { CusField, type CusFieldProps } from '../inputs/CusField'
import type { SelectOption } from './CusSelect'

interface CusNativeSelectProps extends CusFieldProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
}

/** Brauzerning oddiy <select> i — mobil qurilmalarda qulay */
export function CusNativeSelect({
  label,
  helperText,
  errorText,
  isRequired,
  isDisabled,
  isReadOnly,
  className,
  options,
  value,
  defaultValue,
  onChange,
  placeholder,
  size = 'lg',
}: CusNativeSelectProps) {
  return (
    <CusField {...{ label, helperText, errorText, isRequired, isDisabled, isReadOnly, className }}>
      <NativeSelect.Root size={size} width="full">
        <NativeSelect.Field
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={(event) => onChange?.(event.currentTarget.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.isDisabled}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </CusField>
  )
}
