import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { useDiscountList } from '@/features/discounts/api-hooks/useDiscounts'
import { useNewsList } from '@/features/news/api-hooks/useNews'
import { navigate } from '@/utils/navigate'
import { scheduleStatus } from '@/utils/schedule'
import { daysLeft } from '../utils/dashboard'

interface Entry {
  id: number
  title: string
  endsAt?: string | null
}

function Group({ title, to, items }: { title: string; to: string; items: Entry[] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-heading">
          {title} · {items.length}
        </span>
        <button
          type="button"
          onClick={() => navigate(to)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline dark:text-primary-light"
        >
          Hammasi <ArrowRight className="size-3.5" />
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-subtle">Hozir faol yo'q</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {items.slice(0, 4).map((item) => {
            const left = daysLeft(item.endsAt)
            return (
              <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-content">{item.title}</span>
                {left !== null && (
                  <CusBadge color={left <= 1 ? 'danger' : left <= 3 ? 'warning' : 'dark'}>
                    {left <= 0 ? 'bugun tugaydi' : `${left} kun qoldi`}
                  </CusBadge>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/** Hozir faol chegirmalar va yangiliklar, tugashigacha qolgan kun bilan */
export function ActiveContentCard() {
  const { data: discounts, isLoading: loadingDiscounts } = useDiscountList()
  const { data: news, isLoading: loadingNews } = useNewsList()

  const active = useMemo(
    () => ({
      discounts: (discounts ?? []).filter((item) => scheduleStatus(item) === 'active').map((item) => ({ id: item.id, title: item.title, endsAt: item.ends_at })),
      news: (news ?? []).filter((item) => scheduleStatus(item) === 'active').map((item) => ({ id: item.id, title: item.title, endsAt: item.ends_at })),
    }),
    [discounts, news],
  )

  return (
    <CusCard className="h-full">
      <CusCardHeader title="Faol chegirma va yangiliklar" />
      {loadingDiscounts || loadingNews ? (
        <CusSkeleton height="40" />
      ) : (
        <div className="flex flex-col gap-6">
          <Group title="Chegirmalar" to="/discounts" items={active.discounts} />
          <Group title="Yangiliklar" to="/news" items={active.news} />
        </div>
      )}
    </CusCard>
  )
}
