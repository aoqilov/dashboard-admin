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
