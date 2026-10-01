/**
 * Sahifa almashtirish: '/products/12' yoki '/products?page=2'.
 * URL ni o'zgartiradi va App.tsx dagi popstate tinglovchisini ishga tushiradi.
 */
export function navigate(to: string) {
  const current = window.location.pathname + window.location.search
  if (to !== current) window.history.pushState(null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0 })
}
