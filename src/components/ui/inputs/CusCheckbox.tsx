import type { ReactNode } from 'react'
import { Checkbox, CheckboxGroup, Fieldset } from '@chakra-ui/react'

interface CusCheckboxProps {
  children?: ReactNode
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  /** Qisman belgilangan holat (−) */
  indeterminate?: boolean
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  isInvalid?: boolean
  value?: string
  className?: string
}

export function CusCheckbox({
  children,
  checked,
  defaultChecked,
  onChange,
  indeterminate,
  size = 'md',
  isDisabled,
  isInvalid,
  value,
  className,
}: CusCheckboxProps) {
  return (
    <Checkbox.Root
      checked={indeterminate ? 'indeterminate' : checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(details) => onChange?.(details.checked === true)}
      size={size}
      disabled={isDisabled}
      invalid={isInvalid}
      value={value}
      className={className}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      {children && <Checkbox.Label>{children}</Checkbox.Label>}
    </Checkbox.Root>
  )
}

// ─── CheckboxGroup ────────────────────────────────────────────────────────────

interface CusCheckboxGroupProps {
  label?: string
  options: { label: ReactNode; value: string }[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  direction?: 'row' | 'column'
}

export function CusCheckboxGroup({
  label,
  options,
  value,
  defaultValue,
  onChange,
  direction = 'column',
}: CusCheckboxGroupProps) {
  return (
    <Fieldset.Root>
      <CheckboxGroup value={value} defaultValue={defaultValue} onValueChange={onChange}>
        {label && <Fieldset.Legend fontSize="sm" mb="2">{label}</Fieldset.Legend>}
        <Fieldset.Content display="flex" flexDirection={direction} gap="3">
          {options.map((option) => (
            <CusCheckbox key={option.value} value={option.value}>
              {option.label}
            </CusCheckbox>
          ))}
        </Fieldset.Content>
      </CheckboxGroup>
    </Fieldset.Root>
  )
}
