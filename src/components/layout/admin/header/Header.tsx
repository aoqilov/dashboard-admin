import { HeaderLeft } from './HeaderLeft'
import { HeaderRight } from './HeaderRight'

interface HeaderProps {
  mobileOpen: boolean
  onMenuClick: () => void
}

export function Header({ mobileOpen, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-header items-center justify-between gap-3 border-b border-border bg-panel px-4 lg:px-6">
      <HeaderLeft mobileOpen={mobileOpen} onMenuClick={onMenuClick} />
      <HeaderRight />
    </header>
  )
}
