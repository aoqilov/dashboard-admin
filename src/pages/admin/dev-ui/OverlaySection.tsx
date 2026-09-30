import { useState } from 'react'
import { Copy, EllipsisVertical, Filter, Pencil, Share2, Trash2 } from 'lucide-react'
import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusAvatar } from '@/components/ui/avatar/CusAvatar'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { CusDialog } from '@/components/ui/dialog/CusDialog'
import { CusDialogDelete } from '@/components/ui/dialog/CusDialogDelete'
import { CusDrawer } from '@/components/ui/dialog/CusDrawer'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusSwitch } from '@/components/ui/inputs/CusSwitch'
import { CusMenu } from '@/components/ui/menu/CusMenu'
import { CusHoverCard } from '@/components/ui/popover/CusHoverCard'
import { CusPopover } from '@/components/ui/popover/CusPopover'
import { toaster } from '@/components/ui/toaster/toaster'
import { CusTooltip } from '@/components/ui/tooltip/CusTooltip'
import { DevRow } from './DevRow'

/** Dialog, Drawer, Popover, Menu, Tooltip, Toast */
export function OverlaySection() {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const fakeSave = () =>
    toaster.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: { title: 'Saqlanmoqda...' },
      success: { title: 'Saqlandi', description: "O'zgarishlar muvaffaqiyatli saqlandi" },
      error: { title: 'Xatolik' },
    })

  return (
    <CusCard>
      <CusCardHeader title="Overlays — Chakra" />

      <DevRow title="Dialog / Drawer">
        <CusDialog
          trigger={<CusButton>Dialog ochish</CusButton>}
          title="Personal Information"
          description="Profilingizni yangilang"
          footer={
            <>
              <CusButton variant="outline">Bekor qilish</CusButton>
              <CusButton>Saqlash</CusButton>
            </>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <CusInput label="First Name" defaultValue="Musharof" />
            <CusInput label="Last Name" defaultValue="Chowdhury" />
          </div>
        </CusDialog>

        <CusButton variant="danger" leftIcon={<Trash2 />} onClick={() => setDeleteOpen(true)}>
          O'chirish
        </CusButton>
        <CusDialogDelete
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={() => {
            setDeleteOpen(false)
            toaster.create({ title: "O'chirildi", type: 'success' })
          }}
        />

        <CusButton variant="outline" onClick={() => setDrawerOpen(true)}>
          Drawer ochish
        </CusButton>
        <CusDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          title="Sozlamalar"
          footer={<CusButton onClick={() => setDrawerOpen(false)}>Tayyor</CusButton>}
        >
          <div className="flex flex-col gap-5">
            <CusInput label="Kompaniya nomi" defaultValue="Master Admin" />
            <CusSwitch defaultChecked>Email bildirishnomalar</CusSwitch>
            <CusSwitch>SMS bildirishnomalar</CusSwitch>
          </div>
        </CusDrawer>
      </DevRow>

      <DevRow title="Popover / HoverCard / Menu / Tooltip">
        <CusPopover
          trigger={
            <CusButton variant="outline" leftIcon={<Filter />}>
              Filtr
            </CusButton>
          }
          title="Filtrlar"
          footer={<CusButton size="sm" fullWidth>Qo'llash</CusButton>}
        >
          <CusSwitch defaultChecked size="sm">
            Faqat faollar
          </CusSwitch>
          <CusSwitch size="sm">Arxivlanganlar</CusSwitch>
        </CusPopover>

        <CusHoverCard
          trigger={
            <button type="button" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              @musharof
            </button>
          }
        >
          <div className="flex gap-3">
            <CusAvatar name="Musharof Chowdhury" size="lg" status="online" />
            <div>
              <p className="font-semibold text-heading">Musharof Chowdhury</p>
              <p className="text-sm text-muted">Team Manager · Arizona</p>
            </div>
          </div>
        </CusHoverCard>

        <CusMenu
          trigger={<CusIconButton icon={EllipsisVertical} label="Amallar" variant="outline" />}
          onSelect={(value) => toaster.create({ title: `Tanlandi: ${value}` })}
          items={[
            { groupLabel: 'Amallar' },
            { value: 'edit', label: 'Tahrirlash', icon: <Pencil className="size-4" />, shortcut: '⌘E' },
            { value: 'copy', label: 'Nusxalash', icon: <Copy className="size-4" /> },
            { value: 'share', label: 'Ulashish', icon: <Share2 className="size-4" />, isDisabled: true },
            { separator: true },
            { value: 'delete', label: "O'chirish", icon: <Trash2 className="size-4" />, isDanger: true },
          ]}
        />

        <CusTooltip content="Bu tooltip">
          <CusButton variant="ghost">Tooltip</CusButton>
        </CusTooltip>
      </DevRow>

      <DevRow title="Toast (toaster.create)">
        <CusButton variant="outline" onClick={() => toaster.create({ title: 'Saqlandi', type: 'success', closable: true })}>
          Success
        </CusButton>
        <CusButton
          variant="outline"
          onClick={() => toaster.create({ title: 'Xatolik', description: 'Server javob bermadi', type: 'error' })}
        >
          Error
        </CusButton>
        <CusButton variant="outline" onClick={() => toaster.create({ title: 'Diqqat', type: 'warning' })}>
          Warning
        </CusButton>
        <CusButton variant="outline" onClick={fakeSave}>
          Promise
        </CusButton>
      </DevRow>
    </CusCard>
  )
}
