import type { ReactNode } from 'react'
import { EmptyState } from '@chakra-ui/react'
import { Inbox } from 'lucide-react'

interface CusEmptyStateProps {
  title?: string
  description?: ReactNode
  icon?: ReactNode
  /** Masalan "Qo'shish" tugmasi */
  action?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** Ro'yxat yoki jadval bo'sh bo'lganda */
export function CusEmptyState({
  title = "Ma'lumot yo'q",
  description,
  icon = <Inbox />,
  action,
  size = 'md',
  className,
}: CusEmptyStateProps) {
  return (
    <EmptyState.Root size={size} className={className}>
      <EmptyState.Content>
        <EmptyState.Indicator color="fg.subtle">{icon}</EmptyState.Indicator>
        <div className="flex flex-col items-center gap-1 text-center">
          <EmptyState.Title>{title}</EmptyState.Title>
          {description && <EmptyState.Description>{description}</EmptyState.Description>}
        </div>
        {action}
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
