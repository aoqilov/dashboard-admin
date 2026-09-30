import { Menu } from 'lucide-react'

/** Karta burchagidagi ≡ tugma */
export function ChartMenuButton() {
  return (
    <button type="button" aria-label="Chart menu" className="text-muted transition-colors hover:text-heading">
      <Menu className="size-5" />
    </button>
  )
}
