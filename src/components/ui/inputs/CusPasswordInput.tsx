import { useState } from 'react'
import { IconButton, Input, InputGroup, type InputProps } from '@chakra-ui/react'
import { Eye, EyeOff } from 'lucide-react'
import { CusField, type CusFieldProps } from './CusField'

interface CusPasswordInputProps extends CusFieldProps, Omit<InputProps, 'size' | 'type'> {
  size?: 'sm' | 'md' | 'lg'
}

/** Parol maydoni — 👁 bilan ko'rsatish/yashirish */
export function CusPasswordInput({
  label,
  helperText,
  errorText,
  isRequired,
  isDisabled,
  isReadOnly,
  className,
  size = 'lg',
  ...props
}: CusPasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <CusField {...{ label, helperText, errorText, isRequired, isDisabled, isReadOnly, className }}>
      <InputGroup
        endElement={
          <IconButton
            aria-label={visible ? 'Parolni yashirish' : "Parolni ko'rsatish"}
            variant="plain"
            size="sm"
            color="fg.muted"
            onClick={() => setVisible((prev) => !prev)}
          >
            {visible ? <EyeOff /> : <Eye />}
          </IconButton>
        }
      >
        <Input type={visible ? 'text' : 'password'} size={size} fontSize="sm" {...props} />
      </InputGroup>
    </CusField>
  )
}
