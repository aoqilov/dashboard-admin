import { Spinner } from '@chakra-ui/react'

interface CusSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  /** Butun maydonni egallab markazda turadi */
  fullArea?: boolean
  className?: string
}

export function CusSpinner({ size = 'md', label, fullArea, className }: CusSpinnerProps) {
  const spinner = (
    <span className="inline-flex items-center gap-3">
      <Spinner size={size} color="brand.solid" borderWidth="2px" />
      {label && <span className="text-sm text-muted">{label}</span>}
    </span>
  )

  if (!fullArea) return <span className={className}>{spinner}</span>
  return <div className={`flex min-h-40 w-full items-center justify-center ${className ?? ''}`}>{spinner}</div>
}
