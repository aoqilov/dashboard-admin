/** O'zbekiston raqami: +998 dan keyin 9 ta raqam */
export const UZ_PHONE_LENGTH = 9
export const UZ_PHONE_CODE = '+998'

/** "901234567" -> "90 123 45 67" */
export function formatUzPhone(digits: string) {
  const d = digits.slice(0, UZ_PHONE_LENGTH)
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ')
}

/** "901234567" -> "+998901234567" (API uchun) */
export function toUzPhone(digits: string) {
  return `${UZ_PHONE_CODE}${digits}`
}

/** API dagi raqam -> formadagi 9 ta raqam: "+998 90 123-45-67" -> "901234567" */
export function parseUzPhone(value: string | null | undefined) {
  return (value ?? '').replace(/\D/g, '').slice(-UZ_PHONE_LENGTH)
}

/** Jadvalda ko'rsatish: "+998901234567" -> "+998 90 123 45 67". Boshqa formatdagi raqam o'zgarmaydi */
export function displayUzPhone(value: string | null | undefined) {
  if (!value) return ''
  const digits = value.replace(/\D/g, '')
  const isUz = digits.length === UZ_PHONE_LENGTH || (digits.length === 12 && digits.startsWith('998'))
  return isUz ? `${UZ_PHONE_CODE} ${formatUzPhone(digits.slice(-UZ_PHONE_LENGTH))}` : value
}
