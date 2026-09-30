import { TagsInput } from '@chakra-ui/react'
import { CusField, type CusFieldProps } from './CusField'

interface CusTagsInputProps extends CusFieldProps {
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  /** Eng ko'p teglar soni */
  max?: number
  size?: 'sm' | 'md' | 'lg'
}

/** Enter bosib teg qo'shiladigan maydon */
export function CusTagsInput({
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
  placeholder = "Qo'shish...",
  max,
  size = 'lg',
}: CusTagsInputProps) {
  return (
    <CusField {...{ label, helperText, errorText, isRequired, isDisabled, isReadOnly, className }}>
      <TagsInput.Root
        width="full"
        size={size}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(details) => onChange?.(details.value)}
        max={max}
      >
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder={placeholder} />
        </TagsInput.Control>
        <TagsInput.HiddenInput />
      </TagsInput.Root>
    </CusField>
  )
}
