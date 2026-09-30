import { Slider } from '@chakra-ui/react'

interface CusSliderProps {
  label?: string
  /** Bitta qiymat — [50], oraliq — [20, 80] */
  value?: number[]
  defaultValue?: number[]
  onChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  showValue?: boolean
  /** Qiymat ko'rinishi, masalan (v) => `$${v}` */
  formatValue?: (value: number) => string
  marks?: number[]
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  className?: string
}

export function CusSlider({
  label,
  value,
  defaultValue = [50],
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  formatValue = String,
  marks,
  size = 'md',
  isDisabled,
  className,
}: CusSliderProps) {
  return (
    <Slider.Root
      value={value}
      defaultValue={value ? undefined : defaultValue}
      onValueChange={(details) => onChange?.(details.value)}
      min={min}
      max={max}
      step={step}
      size={size}
      disabled={isDisabled}
      className={className}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <Slider.Label>{label}</Slider.Label>}
          {showValue && (
            <Slider.Context>
              {(api) => (
                <span className="text-sm text-muted">{api.value.map(formatValue).join(' – ')}</span>
              )}
            </Slider.Context>
          )}
        </div>
      )}
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
        {marks && <Slider.Marks marks={marks} />}
      </Slider.Control>
    </Slider.Root>
  )
}
