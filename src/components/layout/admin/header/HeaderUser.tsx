import { ChevronDown } from 'lucide-react'
import { CusAvatar } from '@/components/ui/avatar/CusAvatar'

interface HeaderUserProps {
  name: string
  avatar?: string
}

/** Avatar + ism + ▾ (keyinchalik dropdown shu yerga ulanadi) */
export function HeaderUser({ name, avatar }: HeaderUserProps) {
  return (
    <button type="button" className="flex items-center gap-3 text-content">
      <CusAvatar name={name} src={avatar} size="lg" />
      <span className="hidden text-sm font-medium sm:block">{name.split(' ')[0]}</span>
      <ChevronDown className="hidden size-4 text-muted sm:block" />
    </button>
  )
}
