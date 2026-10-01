import type { StoreSocialLink } from '@/api/routes/stores-social-links/storeSocialLinks.types'
import type { TableColumn } from '@/components/ui/table/CusTable'
import { useSocialLinkMutations, useSocialLinks } from '../api-hooks/useStore'
import { SocialLinkModal } from '../modals/SocialLinkModal'
import { PLATFORMS } from '../utils/storeTabs'
import { CrudSection } from './CrudSection'
import { VisibleSwitch } from './VisibleSwitch'

/** Ijtimoiy tarmoq havolalari */
export function SocialLinksTab() {
  const { data = [], isLoading } = useSocialLinks()
  const { update, remove } = useSocialLinkMutations()

  const columns: TableColumn<StoreSocialLink>[] = [
    {
      key: 'platform',
      header: 'Platforma',
      render: (row) => <span className="text-sm font-medium text-heading">{PLATFORMS[row.platform]?.label ?? row.platform}</span>,
    },
    {
      key: 'nickname',
      header: 'Nickname',
      render: (row) => <span className="text-sm text-content">{row.nickname || '—'}</span>,
    },
    {
      key: 'url',
      header: 'Havola',
      render: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="block max-w-xs truncate text-sm text-primary hover:underline dark:text-primary-light"
        >
          {row.url.replace(/^https?:\/\/(www\.)?/, '')}
        </a>
      ),
    },
    {
      key: 'visible',
      header: "Ko'rinadi",
      width: '96px',
      render: (row) => <VisibleSwitch id={row.id} visible={row.visible} update={update} />,
    },
  ]

  return (
    <CrudSection
      noun="Havola"
      columns={columns}
      data={data}
      isLoading={isLoading}
      getName={(row) => row.nickname || (PLATFORMS[row.platform]?.label ?? row.url)}
      remove={remove}
      renderModal={(props) => <SocialLinkModal {...props} />}
    />
  )
}
