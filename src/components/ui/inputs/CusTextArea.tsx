import { Textarea, type TextareaProps } from '@chakra-ui/react'
import { CusField, type CusFieldProps } from './CusField'

interface CusTextAreaProps extends CusFieldProps, Omit<TextareaProps, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  /** Matnga qarab balandlik o'zi oshadi */
  autoresize?: boolean
}

export function CusTextArea({
  label,
  helperText,
  errorText,
  isRequired,
  isDisabled,
  isReadOnly,
  className,
  size = 'md',
  rows = 4,
  ...props
}: CusTextAreaProps) {
  return (
    <CusField {...{ label, helperText, errorText, isRequired, isDisabled, isReadOnly, className }}>
      <Textarea size={size} rows={rows} resize="vertical" bg="transparent" {...props} />
    </CusField>
  )
}
