import { cn } from '@/utils/cn'

interface SidebarLogoProps {
  /** Yig'ilgan holatda faqat belgi ko'rinadi */
  compact?: boolean
}

export function SidebarLogo({ compact }: SidebarLogoProps) {
  return (
    <a href="/" className={cn('flex items-center gap-2.5', compact && 'justify-center')}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-control bg-primary">
        <svg viewBox="0 0 16 16" className="size-4 text-white" aria-hidden>
          <rect x="2" y="3" width="2.5" height="10" rx="1.25" fill="currentColor" />
          <rect x="6.75" y="6" width="2.5" height="7" rx="1.25" fill="currentColor" />
          <rect x="11.5" y="4.5" width="2.5" height="8.5" rx="1.25" fill="currentColor" />
        </svg>
      </span>
      {!compact && (
        <span className="text-xl font-semibold whitespace-nowrap text-heading">Master Admin</span>
      )}
    </a>
  )
}
