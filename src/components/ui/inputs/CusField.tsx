import type { ReactNode } from 'react'
import { Field } from '@chakra-ui/react'

export interface CusFieldProps {
  label?: ReactNode
  helperText?: ReactNode
  /** Berilsa maydon xato holatida bo'ladi */
  errorText?: ReactNode
  isRequired?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  className?: string
}

/** Label + maydon + yordamchi/xato matni. Barcha Chakra inputlar shu bilan o'raladi */
export function CusField({
  label,
  helperText,
  errorText,
  isRequired,
  isDisabled,
  isReadOnly,
  className,
  children,
}: CusFieldProps & { children: ReactNode }) {
  return (
    <Field.Root
      invalid={Boolean(errorText)}
      required={isRequired}
      disabled={isDisabled}
      readOnly={isReadOnly}
      className={className}
    >
      {label && (
        <Field.Label fontWeight="medium" color="var(--color-content)">
          {label}
          <Field.RequiredIndicator />
        </Field.Label>
      )}
      {children}
      {errorText ? (
        <Field.ErrorText>{errorText}</Field.ErrorText>
      ) : (
        helperText && <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  )
}
