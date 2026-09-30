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
    <div className="mt-5 first:mt-0">
      <p
        className={cn(
          'mb-3 flex text-xs leading-5 uppercase text-subtle',
          compact ? 'justify-center' : 'justify-start',
        )}
      >
        {compact ? <Ellipsis className="size-5" /> : title}
      </p>
      <ul className="flex flex-col gap-1">{children}</ul>
    </div>
  )
}
