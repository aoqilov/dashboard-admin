import { AlignLeft, X } from 'lucide-react'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { CusSearchInput } from '@/components/ui/inputs/CusSearchInput'
import { SidebarLogo } from '../sidebar/SidebarLogo'

interface HeaderLeftProps {
  mobileOpen: boolean
  onMenuClick: () => void
}

export function HeaderLeft({ mobileOpen, onMenuClick }: HeaderLeftProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-4">
      <CusIconButton
        icon={mobileOpen ? X : AlignLeft}
        label="Toggle sidebar"
        variant="ghost"
        shape="square"
        onClick={onMenuClick}
      />
      <div className="lg:hidden">
        <SidebarLogo compact />
      </div>
      <CusSearchInput shortcut className="hidden max-w-[430px] border-transparent bg-body shadow-none lg:flex dark:bg-panel" />
    </div>
  )
}
