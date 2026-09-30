import { Check } from 'lucide-react'
import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusSwitch } from '@/components/ui/inputs/CusSwitch'
import { CusLabel } from '@/components/ui/typography/CusTypography'
import { useTheme } from '@/hooks/useTheme'
import { ACCENTS, getAccentColor } from '@/theme/accents'
import { cn } from '@/utils/cn'

/** Tema: dark rejim + accent rang. Tanlov darhol qo'llanadi va brauzerda saqlanadi */
export function AppearanceCard() {
  const { theme, toggleTheme, accent, setAccent } = useTheme()

  return (
    <CusCard>
      <CusCardHeader title="Ko'rinish" />
      <div className="flex flex-col gap-6">
        <CusSwitch checked={theme === 'dark'} onChange={toggleTheme}>
          Qorong'i rejim
        </CusSwitch>

        <div>
          <CusLabel className="mb-3">Asosiy rang</CusLabel>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Asosiy rang">
            {ACCENTS.map((item) => {
              const isActive = item.value === accent
              return (
                <button
                  key={item.value}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => setAccent(item.value)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-control border px-3.5 py-2.5 text-sm font-medium transition-colors',
                    'focus-visible:shadow-focus focus-visible:outline-none',
                    isActive
                      ? 'border-primary bg-primary/8 text-heading dark:bg-primary/12'
                      : 'border-border-strong text-content hover:bg-hover',
                  )}
                >
                  <span
                    className="flex size-5 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: getAccentColor(item.value, theme) }}
                  >
                    {isActive && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </CusCard>
  )
}
