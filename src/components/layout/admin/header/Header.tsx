import { HeaderLeft } from './HeaderLeft'
import { HeaderRight } from './HeaderRight'

interface HeaderProps {
  mobileOpen: boolean
  onMenuClick: () => void
}

export function Header({ mobileOpen, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-header items-center justify-between gap-3 bg-topbar px-4 shadow-topbar lg:px-6">
      <HeaderLeft mobileOpen={mobileOpen} onMenuClick={onMenuClick} />
      <HeaderRight />
    </header>
  )
}
