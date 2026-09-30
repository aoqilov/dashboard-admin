import { Fragment, type ReactNode } from 'react'
import { Breadcrumb } from '@chakra-ui/react'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbEntry {
  label: ReactNode
  href?: string
  onClick?: () => void
  icon?: ReactNode
}

interface CusBreadCrumbProps {
  /** Oxirgi element — joriy sahifa */
  items: BreadcrumbEntry[]
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CusBreadCrumb({ items, size = 'md', className }: CusBreadCrumbProps) {
  return (
    <Breadcrumb.Root size={size} className={className}>
      <Breadcrumb.List>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={index}>
              <Breadcrumb.Item>
                {isLast ? (
                  <Breadcrumb.CurrentLink color="fg">
                    {item.icon}
                    {item.label}
                  </Breadcrumb.CurrentLink>
                ) : (
                  <Breadcrumb.Link
                    href={item.href}
                    onClick={item.onClick}
                    color="fg.muted"
                    _hover={{ color: 'brand.fg' }}
                    cursor="pointer"
                  >
                    {item.icon}
                    {item.label}
                  </Breadcrumb.Link>
                )}
              </Breadcrumb.Item>
              {!isLast && (
                <Breadcrumb.Separator color="fg.subtle">
                  <ChevronRight />
                </Breadcrumb.Separator>
              )}
            </Fragment>
          )
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}
