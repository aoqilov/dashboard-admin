/**
 * Router ulanguncha sahifa almashtirish.
 * URL ni o'zgartiradi va App.tsx dagi popstate tinglovchisini ishga tushiradi.
 */
export function navigate(path: string) {
  if (path !== window.location.pathname) window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
