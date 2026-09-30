/** Komponentlarning rang variantlari — src/index.css dagi @theme ranglariga mos */
export type ColorVariant = 'primary' | 'danger' | 'success' | 'info' | 'warning' | 'dark'

/** Och fon + rangli matn (badge, ikonka foni) */
export const SOFT_COLORS: Record<ColorVariant, string> = {
  primary: 'bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary-light',
  danger: 'bg-danger/10 text-danger dark:bg-danger/15',
  success: 'bg-success/10 text-success dark:bg-success/15',
  info: 'bg-info/10 text-info dark:bg-info/15',
  warning: 'bg-warning/10 text-warning dark:bg-warning/15',
  dark: 'bg-hover text-heading',
}

/** To'liq rangli fon + oq matn */
export const SOLID_COLORS: Record<ColorVariant, string> = {
  primary: 'bg-primary text-white',
  danger: 'bg-danger text-white',
  success: 'bg-success text-white',
  info: 'bg-info text-white',
  warning: 'bg-warning text-white',
  dark: 'bg-dark text-body',
}

/** Faqat matn rangi */
export const TEXT_COLORS: Record<ColorVariant, string> = {
  primary: 'text-primary dark:text-primary-light',
  danger: 'text-danger',
  success: 'text-success',
  info: 'text-info',
  warning: 'text-warning',
  dark: 'text-dark',
}
