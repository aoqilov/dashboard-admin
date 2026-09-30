import { DatePicker, parseDate, Portal } from '@chakra-ui/react'
import { CalendarDays } from 'lucide-react'
import { CusField, type CusFieldProps } from '../inputs/CusField'

interface CusDatePickerProps extends CusFieldProps {
  /** ISO format: '2026-09-29' */
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  /** Eng erta / eng kech sana (ISO) */
  min?: string
  max?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
}

const toDates = (value?: string) => (value ? [parseDate(value)] : undefined)

export function CusDatePicker({
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
  min,
  max,
  placeholder = 'yyyy-mm-dd',
  size = 'lg',
}: CusDatePickerProps) {
  return (
    <CusField {...{ label, helperText, errorText, isRequired, isDisabled, isReadOnly, className }}>
      <DatePicker.Root
        width="full"
        size={size}
        value={value === undefined ? undefined : (toDates(value) ?? [])}
        defaultValue={toDates(defaultValue)}
        onValueChange={(details) => onChange?.(details.value[0]?.toString() ?? '')}
        min={min ? parseDate(min) : undefined}
        max={max ? parseDate(max) : undefined}
        locale="en-CA"
        startOfWeek={1}
      >
        <DatePicker.Control>
          <DatePicker.Input placeholder={placeholder} />
          <DatePicker.IndicatorGroup>
            <DatePicker.Trigger>
              <CalendarDays />
            </DatePicker.Trigger>
          </DatePicker.IndicatorGroup>
        </DatePicker.Control>
        <Portal>
          <DatePicker.Positioner>
            <DatePicker.Content>
              <DatePicker.View view="day">
                <DatePicker.Header />
                <DatePicker.DayTable />
              </DatePicker.View>
              <DatePicker.View view="month">
                <DatePicker.Header />
                <DatePicker.MonthTable />
              </DatePicker.View>
              <DatePicker.View view="year">
                <DatePicker.Header />
                <DatePicker.YearTable />
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>
    </CusField>
  )
}
