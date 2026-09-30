import { ButtonGroup, IconButton, Pagination } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CusPaginationProps {
  /** Jami elementlar soni */
  total: number
  pageSize?: number
  page?: number
  defaultPage?: number
  onChange?: (page: number) => void
  /** "1–10 / 97" matni */
  showSummary?: boolean
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

export function CusPagination({
  total,
  pageSize = 10,
  page,
  defaultPage = 1,
  onChange,
  showSummary = true,
  size = 'sm',
  className,
}: CusPaginationProps) {
  return (
    <Pagination.Root
      count={total}
      pageSize={pageSize}
      page={page}
      defaultPage={page === undefined ? defaultPage : undefined}
      onPageChange={(details) => onChange?.(details.page)}
      className={className}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        {showSummary && <Pagination.PageText format="long" color="fg.muted" fontSize="sm" />}
        <ButtonGroup variant="outline" size={size} attached={false} gap="1.5">
          <Pagination.PrevTrigger asChild>
            <IconButton aria-label="Oldingi sahifa" borderRadius="l2">
              <ChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>
          <Pagination.Items
            render={(item) => (
              <IconButton
                variant={{ base: 'ghost', _selected: 'solid' }}
                borderRadius="l2"
                aria-label={`Sahifa ${item.value}`}
              >
                {item.value}
              </IconButton>
            )}
          />
          <Pagination.NextTrigger asChild>
            <IconButton aria-label="Keyingi sahifa" borderRadius="l2">
              <ChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </div>
    </Pagination.Root>
  )
}
