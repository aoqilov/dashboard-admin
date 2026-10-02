import { useMemo, type ReactNode } from 'react'
import { createListCollection, Portal, Select } from '@chakra-ui/react'
import { CusField, type CusFieldProps } from '../inputs/CusField'

export interface SelectOption {
  label: string
  value: string
  isDisabled?: boolean
  /** Nom oldida ko'rinadigan belgi/rasm (ro'yxatda ham, tanlanganda ham) */
  icon?: ReactNode
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
  /** Ro'yxat ekran balandligigacha to'liq ochiladi (ichki scroll faqat sig'masa) */
  fullHeight?: boolean
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
  fullHeight,
}: CusSelectProps) {
  const collection = useMemo(
    () => createListCollection({ items: options, isItemDisabled: (item) => Boolean(item.isDisabled) }),
    [options],
  )

  const selected = multiple ? undefined : options.find((o) => o.value === value?.[0])

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
            <Select.ValueText placeholder={placeholder}>{selected?.icon ? <OptionLabel option={selected} /> : undefined}</Select.ValueText>
          </Select.Trigger>
          <Select.IndicatorGroup>
            {clearable && <Select.ClearTrigger />}
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content maxH={fullHeight ? 'calc(100vh - 6rem)' : undefined}>
              {collection.items.map((item) => (
                <Select.Item key={item.value} item={item}>
                  <OptionLabel option={item} />
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

function OptionLabel({ option }: { option: SelectOption }) {
  if (!option.icon) return <>{option.label}</>
  return (
    <span className="flex min-w-0 items-center gap-3">
      {option.icon}
      <span className="truncate">{option.label}</span>
    </span>
  )
}
