import { useMemo } from 'react'
import { createListCollection, Portal, Select } from '@chakra-ui/react'
import { CusField, type CusFieldProps } from '../inputs/CusField'

export interface SelectOption {
  label: string
  value: string
  isDisabled?: boolean
}

interface CusSelectProps extends CusFieldProps {
  options: SelectOption[]
  /** Bitta tanlovda — [value], ko'p tanlovda — [a, b] */
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  multiple?: boolean
  /** Tanlovni tozalash tugmasi */
  clearable?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CusSelect({
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
  placeholder = 'Tanlang',
  multiple,
  clearable,
  size = 'lg',
}: CusSelectProps) {
  const collection = useMemo(
    () => createListCollection({ items: options, isItemDisabled: (item) => Boolean(item.isDisabled) }),
    [options],
  )

  return (
    <CusField {...{ label, helperText, errorText, isRequired, isDisabled, isReadOnly, className }}>
      <Select.Root
        collection={collection}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(details) => onChange?.(details.value)}
        multiple={multiple}
        size={size}
        width="full"
        positioning={{ sameWidth: true }}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder={placeholder} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            {clearable && <Select.ClearTrigger />}
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {collection.items.map((item) => (
                <Select.Item key={item.value} item={item}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </CusField>
  )
}
