import { getErrorMessage } from '@/api/api-config/apiError'
import { CusSwitch } from '@/components/ui/inputs/CusSwitch'
import { toaster } from '@/components/ui/toaster/toaster'

type VisibleVars = { id: number; body: { visible?: boolean } }

interface VisibleSwitchProps {
  id: number
  visible?: boolean
  /** useCrudMutations().update */
  update: {
    mutate: (vars: { id: number; body: { visible: boolean } }, options?: { onError?: (err: Error) => void }) => void
    isPending: boolean
    variables?: VisibleVars
  }
}

/** Jadvaldagi "Ko'rinadi" switch'i — modal ochmasdan PATCH { visible } */
export function VisibleSwitch({ id, visible, update }: VisibleSwitchProps) {
  // So'rov ketayotganda yangi qiymat darhol ko'rinadi
  const pending = update.isPending && update.variables?.id === id ? update.variables.body.visible : undefined
  const checked = (pending ?? visible) !== false

  return (
    <div onClick={(event) => event.stopPropagation()} className="flex">
      <CusSwitch
        size="sm"
        checked={checked}
        onChange={(next) =>
          update.mutate(
            { id, body: { visible: next } },
            { onError: (err) => toaster.create({ type: 'error', title: getErrorMessage(err) }) },
          )
        }
      />
    </div>
  )
}
