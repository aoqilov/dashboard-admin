import type { ReactNode } from 'react'
import { Menu, Portal } from '@chakra-ui/react'

export type MenuEntry =
  | {
      value: string
      label: ReactNode
      icon?: ReactNode
      /** O'ng tomonda: ⌘E kabi */
      shortcut?: string
      /** Qizil — o'chirish kabi xavfli amal */
      isDanger?: boolean
      isDisabled?: boolean
    }
  | { separator: true }
  | { groupLabel: string }

interface CusMenuProps {
  trigger: ReactNode
  items: MenuEntry[]
  onSelect?: (value: string) => void
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
}

/** Ochiladigan amallar ro'yxati (⋯ tugmasi, foydalanuvchi menyusi) */
export function CusMenu({ trigger, items, onSelect, placement = 'bottom-end' }: CusMenuProps) {
  return (
    <Menu.Root onSelect={(details) => onSelect?.(details.value)} positioning={{ placement }}>
      <Menu.Trigger asChild>{trigger}</Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minW="48" borderRadius="xl" p="1.5">
            {items.map((item, index) => {
              if ('separator' in item) return <Menu.Separator key={`sep-${index}`} />
              if ('groupLabel' in item) {
                return (
                  <Menu.ItemGroupLabel key={`group-${index}`} color="fg.subtle" fontSize="xs">
                    {item.groupLabel}
                  </Menu.ItemGroupLabel>
                )
              }
              return (
                <Menu.Item
                  key={item.value}
                  value={item.value}
                  disabled={item.isDisabled}
                  borderRadius="l2"
                  py="2"
                  color={item.isDanger ? 'fg.error' : undefined}
                  _highlighted={item.isDanger ? { bg: 'bg.error' } : undefined}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && <Menu.ItemCommand>{item.shortcut}</Menu.ItemCommand>}
                </Menu.Item>
              )
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
