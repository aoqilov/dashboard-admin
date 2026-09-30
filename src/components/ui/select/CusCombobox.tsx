import { Combobox, Portal, useFilter, useListCollection } from '@chakra-ui/react'
import { CusField, type CusFieldProps } from '../inputs/CusField'
import type { SelectOption } from './CusSelect'

interface CusComboboxProps extends CusFieldProps {
  options: SelectOption[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  multiple?: boolean
  emptyText?: string
  size?: 'sm' | 'md' | 'lg'
}

/** Yozib qidiriladigan select */
export function CusCombobox({
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
  placeholder = 'Qidirish...',
  multiple,
  emptyText = 'Hech narsa topilmadi',
  size = 'lg',
}: CusComboboxProps) {
  const { contains } = useFilter({ sensitivity: 'base' })
  const { collection, filter } = useListCollection({ initialItems: options, filter: contains })

  return (
    <CusField {...{ label, helperText, errorText, isRequired, isDisabled, isReadOnly, className }}>
      <Combobox.Root
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(details) => onChange?.(details.value)}
        multiple={multiple}
        size={size}
        width="full"
      >
        <Combobox.Control>
          <Combobox.Input placeholder={placeholder} />
          <Combobox.IndicatorGroup>
            <Combobox.ClearTrigger />
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.Empty>{emptyText}</Combobox.Empty>
              {collection.items.map((item) => (
                <Combobox.Item key={item.value} item={item}>
                  {item.label}
                  <Combobox.ItemIndicator />
                </Combobox.Item>
              ))}
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
    </CusField>
  )
}
