import { Input, InputGroup } from '@chakra-ui/react'
import { formatUzPhone, UZ_PHONE_CODE, UZ_PHONE_LENGTH } from '@/utils/phone'
import { CusField, type CusFieldProps } from './CusField'

interface CusPhoneInputProps extends CusFieldProps {
  /** Faqat 9 ta raqam, +998 siz: "901234567" */
  value: string
  onChange: (digits: string) => void
  onBlur?: () => void
  size?: 'md' | 'lg'
  autoFocus?: boolean
}

/** +998 kodli telefon raqam maydoni. API ga yuborishda: `+998${value}` */
export function CusPhoneInput({
  label,
  helperText,
  errorText,
  isRequired,
  isDisabled,
  isReadOnly,
  className,
  value,
  onChange,
  onBlur,
  size = 'lg',
  autoFocus,
}: CusPhoneInputProps) {
  return (
    <CusField {...{ label, helperText, errorText, isRequired, isDisabled, isReadOnly, className }}>
      <InputGroup
        startElement={<span className="text-sm font-medium text-heading">{UZ_PHONE_CODE}</span>}
        startElementProps={{ pointerEvents: 'none' }}
      >
        <Input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="90 123 45 67"
          size={size}
          ps="14"
          value={formatUzPhone(value)}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, UZ_PHONE_LENGTH))}
          onBlur={onBlur}
          autoFocus={autoFocus}
        />
      </InputGroup>
    </CusField>
  )
}
