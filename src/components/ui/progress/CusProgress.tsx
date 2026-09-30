import { AbsoluteCenter, Progress, ProgressCircle } from '@chakra-ui/react'

type Palette = 'brand' | 'green' | 'red' | 'orange' | 'blue' | 'gray'

interface CusProgressProps {
  /** null — cheksiz (indeterminate) animatsiya */
  value: number | null
  max?: number
  label?: string
  showValue?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  colorPalette?: Palette
  striped?: boolean
  className?: string
}

/** Chiziqli progress */
export function CusProgress({
  value,
  max = 100,
  label,
  showValue,
  size = 'sm',
  colorPalette = 'brand',
  striped,
  className,
}: CusProgressProps) {
  return (
    <Progress.Root
      value={value}
      max={max}
      size={size}
      colorPalette={colorPalette}
      striped={striped}
      animated={striped}
      className={className}
    >
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between">
          {label && <Progress.Label fontWeight="medium">{label}</Progress.Label>}
          {showValue && <Progress.ValueText color="fg.muted" />}
        </div>
      )}
      <Progress.Track borderRadius="full">
        <Progress.Range borderRadius="full" />
      </Progress.Track>
    </Progress.Root>
  )
}

// ─── ProgressCircle ───────────────────────────────────────────────────────────

interface CusProgressCircleProps {
  value: number | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showValue?: boolean
  colorPalette?: Palette
}

/** Aylana progress */
export function CusProgressCircle({ value, size = 'lg', showValue = true, colorPalette = 'brand' }: CusProgressCircleProps) {
  return (
    <ProgressCircle.Root value={value} size={size} colorPalette={colorPalette}>
      <ProgressCircle.Circle>
        <ProgressCircle.Track />
        <ProgressCircle.Range strokeLinecap="round" />
      </ProgressCircle.Circle>
      {showValue && value !== null && (
        <AbsoluteCenter>
          <ProgressCircle.ValueText />
        </AbsoluteCenter>
      )}
    </ProgressCircle.Root>
  )
}
