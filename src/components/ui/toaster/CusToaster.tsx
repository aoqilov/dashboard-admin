import { Portal, Spinner, Toast, Toaster } from '@chakra-ui/react'
import { toaster } from './toaster'

/** main.tsx da bir marta ulanadi */
export function CusToaster() {
  return (
    <Portal>
      <Toaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast) => (
          <Toast.Root width={{ md: 'sm' }} borderRadius="l3">
            {toast.type === 'loading' ? <Spinner size="sm" color="brand.solid" /> : <Toast.Indicator />}
            <div className="flex max-w-full flex-1 flex-col gap-1">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
            </div>
            {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </Toaster>
    </Portal>
  )
}
