import type { ReactNode } from 'react'
import { Ellipsis } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SidebarGroupProps {
  title: string
  compact: boolean
  children: ReactNode
}

export function SidebarGroup({ title, compact, children }: SidebarGroupProps) {
  return (
    <div className="mt-6 first:mt-0">
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
