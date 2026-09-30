import { Moon, Sun } from 'lucide-react'
import { SidebarLogo } from '@/components/layout/admin/sidebar/SidebarLogo'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { CusLabel, CusTitle } from '@/components/ui/typography/CusTypography'
import { useTheme } from '@/hooks/useTheme'
import { LoginBrandPanel } from './components/LoginBrandPanel'
import { LoginForm } from './components/LoginForm'

/** [ Forma | Brend paneli ] — mobilda faqat forma */
export default function FeatureLogin() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex min-h-screen bg-body">
      <div className="flex flex-1 flex-col px-6 py-10 sm:px-10">
        <div className="lg:hidden">
          <SidebarLogo />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="mb-8">
            <CusTitle as="h1" className="text-4xl">
              Kirish
            </CusTitle>
            <CusLabel className="mt-2">Login va parolingizni kiriting</CusLabel>
          </div>

          <LoginForm />
        </div>
      </div>

      <LoginBrandPanel />

      <CusIconButton
        icon={theme === 'dark' ? Sun : Moon}
        label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        variant="outline"
        onClick={toggleTheme}
        className="fixed right-6 bottom-6 z-10"
      />
    </div>
  )
}
