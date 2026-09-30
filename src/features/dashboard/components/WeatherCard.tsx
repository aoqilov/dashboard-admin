import { Sun } from 'lucide-react'
import { CusCard } from '@/components/shared/card/CusCard'
import { WEATHER } from '@/data/dashboard'

export function WeatherCard() {
  return (
    <CusCard>
      <div className="flex items-center gap-4">
        <Sun className="size-11 text-heading" strokeWidth={1.6} />
        <p className="text-4xl font-medium text-heading">
          {WEATHER.temperature}°<span className="text-2xl">C</span>
        </p>
      </div>
      <div className="mt-2 text-right">
        <p className="text-sm text-heading">{WEATHER.date}</p>
        <p className="text-lg font-medium text-heading">{WEATHER.city}</p>
      </div>
    </CusCard>
  )
}
