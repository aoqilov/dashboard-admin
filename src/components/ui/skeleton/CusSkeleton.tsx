import type { ReactNode } from 'react'
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'

interface CusSkeletonProps {
  /** false bo'lganda children ko'rsatiladi */
  isLoading?: boolean
  children?: ReactNode
  height?: string
  width?: string
  borderRadius?: string
  className?: string
}

/** Yuklanayotgan blok o'rnidagi kulrang joy */
export function CusSkeleton({
  isLoading = true,
  children,
  height = '5',
  width = 'full',
  borderRadius = 'l2',
  className,
}: CusSkeletonProps) {
  return (
    <Skeleton loading={isLoading} height={children ? undefined : height} width={width} borderRadius={borderRadius} className={className}>
      {children}
    </Skeleton>
  )
}

export function CusSkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return <SkeletonText noOfLines={lines} gap="3" className={className} />
}

export function CusSkeletonCircle({ size = '10' }: { size?: string }) {
  return <SkeletonCircle size={size} />
}
