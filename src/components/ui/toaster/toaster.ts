import { createToaster } from '@chakra-ui/react'

/**
 * Global toaster. Istalgan joydan:
 *   toaster.create({ title: 'Saqlandi', type: 'success' })
 *   toaster.promise(promise, { loading: {...}, success: {...}, error: {...} })
 */
export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
  max: 5,
})
