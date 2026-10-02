import type { ReactNode } from 'react'
import { Ellipsis } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SidebarGroupProps {
  title: string
  compact: boolean
  /** Oldingi bo'limdan chiziq bilan ajratiladi */
  divider?: boolean
  children: ReactNode
}

export function SidebarGroup({ title, compact, divider, children }: SidebarGroupProps) {
  return (
    <div className="mt-4 first:mt-0">
      {divider && <div className="mx-6 mb-4 border-t border-border" />}
      <p
        className={cn(
          'mb-2 flex px-6 text-xs leading-5 text-muted',
          compact ? 'justify-center' : 'justify-start',
        )}
      >
        {compact ? <Ellipsis className="size-5" /> : title}
      </p>
      <ul className="flex flex-col">{children}</ul>
    </div>
  )
}
