import type { ReactNode } from 'react'
import { Timeline } from '@chakra-ui/react'

export interface TimelineEntry {
  title: ReactNode
  description?: ReactNode
  /** Vaqt yoki sana */
  time?: ReactNode
  icon?: ReactNode
}

interface CusTimelineProps {
  items: TimelineEntry[]
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'subtle' | 'solid' | 'outline' | 'plain'
  className?: string
}

/** Faoliyat tarixi (activity log) */
export function CusTimeline({ items, size = 'md', variant = 'subtle', className }: CusTimelineProps) {
  return (
    <Timeline.Root size={size} variant={variant} className={className}>
      {items.map((item, index) => (
        <Timeline.Item key={index}>
          <Timeline.Connector>
            <Timeline.Separator />
            <Timeline.Indicator>{item.icon}</Timeline.Indicator>
          </Timeline.Connector>
          <Timeline.Content>
            <Timeline.Title>{item.title}</Timeline.Title>
            {item.description && <Timeline.Description>{item.description}</Timeline.Description>}
            {item.time && <span className="text-xs text-subtle">{item.time}</span>}
          </Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline.Root>
  )
}
