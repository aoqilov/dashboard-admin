import { RatingGroup } from '@chakra-ui/react'

interface CusRatingProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  count?: number
  /** Yarim yulduz */
  allowHalf?: boolean
  size?: 'sm' | 'md' | 'lg'
  isReadOnly?: boolean
  isDisabled?: boolean
  className?: string
}

export function CusRating({
  value,
  defaultValue,
  onChange,
  count = 5,
  allowHalf,
  size = 'md',
  isReadOnly,
  isDisabled,
  className,
}: CusRatingProps) {
  return (
    <RatingGroup.Root
      count={count}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(details) => onChange?.(details.value)}
      allowHalf={allowHalf}
      size={size}
      readOnly={isReadOnly}
      disabled={isDisabled}
      colorPalette="orange"
      className={className}
    >
      <RatingGroup.HiddenInput />
      <RatingGroup.Control />
    </RatingGroup.Root>
  )
}
