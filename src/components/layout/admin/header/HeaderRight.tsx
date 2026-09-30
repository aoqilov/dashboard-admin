import { Bell, Moon, Sun } from 'lucide-react'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { useTheme } from '@/hooks/useTheme'
import { HeaderUser } from './HeaderUser'

export function HeaderRight() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <CusIconButton
        icon={theme === 'dark' ? Sun : Moon}
        label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        variant="outline"
        onClick={toggleTheme}
      />
      <CusIconButton icon={Bell} label="Notifications" variant="outline" dot />
      <HeaderUser name="Sarah Parker" />
    </div>
  )
}
