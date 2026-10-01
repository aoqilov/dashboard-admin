import { useState, type FormEvent } from 'react'
import { getErrorMessage, getFieldErrors } from '@/api/api-config/apiError'
import { toaster } from '@/components/ui/toaster/toaster'

export type FormErrors<V> = Partial<Record<keyof V, string>>

interface EntityFormOptions<V, Req> {
  initial: V
  /** Bo'sh obyekt — xato yo'q */
  validate: (values: V) => FormErrors<V>
  toRequest: (values: V) => Req
  /** create yoki update so'rovi */
  save: (body: Req) => Promise<unknown>
  /** Muvaffaqiyatli saqlangandagi toast matni */
  successText: string
  onSuccess: () => void
}

/**
 * Modal formasi: qiymatlar, xatolar va saqlash.
 * Backend maydon xatolari (400) tegishli maydon ostida ko'rsatiladi.
 * Forma kalitlari API maydonlari bilan bir xil nomlanadi.
 */
export function useEntityForm<V extends object, Req>({
  initial,
  validate,
  toRequest,
  save,
  successText,
  onSuccess,
}: EntityFormOptions<V, Req>) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState<FormErrors<V>>({})
  const [isSaving, setIsSaving] = useState(false)

  const set = <K extends keyof V>(key: K, value: V[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    // Modal ichidan ochilgan modal formasi tashqi formani submit qilmasin (portal orqali bubble)
    event.stopPropagation()
    const nextErrors = validate(values)
    if (Object.values(nextErrors).some(Boolean)) return setErrors(nextErrors)

    setIsSaving(true)
    try {
      await save(toRequest(values))
      toaster.create({ type: 'success', title: successText })
      onSuccess()
    } catch (err) {
      setErrors(getFieldErrors(err) as FormErrors<V>)
      toaster.create({ type: 'error', title: getErrorMessage(err) })
    } finally {
      setIsSaving(false)
    }
  }

  return { values, errors, set, handleSubmit, isSaving }
}
