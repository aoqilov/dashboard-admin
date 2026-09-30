import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

/**
 * Chakra UI tizimi — src/index.css dagi tokenlarga bog'langan.
 *
 * - bg / fg / border semantik tokenlari bizning CSS o'zgaruvchilarimizga ulanadi,
 *   shuning uchun Chakra komponentlari light/dark bilan o'zi almashadi (.dark klassi).
 * - `brand` palitrasi — tanlangan accent (index.css dagi --brand-*). Barcha komponentlar default shu rangda.
 * - `gray` — TailAdmin kulrang shkalasi (outline / ghost / subtle variantlar uchun).
 * - preflight o'chirilgan: reset'ni Tailwind qiladi.
 */
const config = defineConfig({
  preflight: false,
  globalCss: {
    html: {
      color: 'var(--color-content)',
      bg: 'var(--color-body)',
      colorPalette: 'brand',
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'var(--font-sans)' },
        body: { value: 'var(--font-sans)' },
      },
      radii: {
        l1: { value: '3px' },
        l2: { value: 'var(--radius-control)' },
        l3: { value: '6px' },
      },
      colors: {
        brand: {
          25: { value: 'var(--brand-25)' },
          50: { value: 'var(--brand-50)' },
          100: { value: 'var(--brand-100)' },
          200: { value: 'var(--brand-200)' },
          300: { value: 'var(--brand-300)' },
          400: { value: 'var(--brand-400)' },
          500: { value: 'var(--brand-500)' },
          600: { value: 'var(--brand-600)' },
          700: { value: 'var(--brand-700)' },
          800: { value: 'var(--brand-800)' },
          900: { value: 'var(--brand-900)' },
          950: { value: 'var(--brand-950)' },
        },
        gray: {
          50: { value: '#f9fafb' },
          100: { value: '#f2f4f7' },
          200: { value: '#e4e7ec' },
          300: { value: '#d0d5dd' },
          400: { value: '#98a2b3' },
          500: { value: '#667085' },
          600: { value: '#475467' },
          700: { value: '#344054' },
          800: { value: '#1d2939' },
          900: { value: '#101828' },
          950: { value: '#0c111d' },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: 'var(--color-surface)' },
          subtle: { value: 'var(--color-body)' },
          muted: { value: 'var(--color-hover)' },
          emphasized: { value: 'var(--color-border)' },
          panel: { value: 'var(--color-surface)' },
          inverted: { value: 'var(--color-heading)' },
          // Holat fonlari (Alert, Toast) — dark rejimda yarim shaffof
          error: { value: { _light: '#fef3f2', _dark: 'rgb(240 68 56 / 0.12)' } },
          warning: { value: { _light: '#fff6ed', _dark: 'rgb(251 101 20 / 0.12)' } },
          success: { value: { _light: '#ecfdf3', _dark: 'rgb(18 183 106 / 0.12)' } },
          info: { value: { _light: '#f0f9ff', _dark: 'rgb(11 165 236 / 0.12)' } },
        },
        fg: {
          DEFAULT: { value: 'var(--color-heading)' },
          muted: { value: 'var(--color-muted)' },
          subtle: { value: 'var(--color-subtle)' },
          inverted: { value: 'var(--color-surface)' },
          error: { value: 'var(--color-danger)' },
          warning: { value: 'var(--color-warning)' },
          success: { value: 'var(--color-success)' },
          info: { value: 'var(--color-info)' },
        },
        border: {
          DEFAULT: { value: 'var(--color-border-strong)' },
          muted: { value: 'var(--color-border)' },
          subtle: { value: 'var(--color-border)' },
          emphasized: { value: 'var(--color-border-strong)' },
        },
        brand: {
          solid: { value: '{colors.brand.500}' },
          contrast: { value: 'white' },
          fg: { value: { _light: '{colors.brand.500}', _dark: '{colors.brand.300}' } },
          muted: { value: { _light: '{colors.brand.100}', _dark: '{colors.brand.900}' } },
          subtle: { value: { _light: '{colors.brand.50}', _dark: 'color-mix(in srgb, var(--brand-500) 15%, transparent)' } },
          emphasized: { value: { _light: '{colors.brand.200}', _dark: '{colors.brand.800}' } },
          focusRing: { value: '{colors.brand.500}' },
        },
        // Holat palitralari (Alert, Tag, Badge subtle/surface) — dark rejimda yarim shaffof fon
        green: {
          fg: { value: { _light: '#039855', _dark: '#32d583' } },
          subtle: { value: { _light: '#ecfdf3', _dark: 'rgb(18 183 106 / 0.12)' } },
          muted: { value: { _light: '#d1fadf', _dark: 'rgb(18 183 106 / 0.28)' } },
        },
        red: {
          fg: { value: { _light: '#d92d20', _dark: '#f97066' } },
          subtle: { value: { _light: '#fef3f2', _dark: 'rgb(240 68 56 / 0.12)' } },
          muted: { value: { _light: '#fee4e2', _dark: 'rgb(240 68 56 / 0.28)' } },
        },
        orange: {
          fg: { value: { _light: '#ec4a0a', _dark: '#fd853a' } },
          subtle: { value: { _light: '#fff6ed', _dark: 'rgb(251 101 20 / 0.12)' } },
          muted: { value: { _light: '#ffead5', _dark: 'rgb(251 101 20 / 0.28)' } },
        },
        blue: {
          fg: { value: { _light: '#0086c9', _dark: '#36bffa' } },
          subtle: { value: { _light: '#f0f9ff', _dark: 'rgb(11 165 236 / 0.12)' } },
          muted: { value: { _light: '#e0f2fe', _dark: 'rgb(11 165 236 / 0.28)' } },
        },
        gray: {
          solid: { value: { _light: '{colors.gray.800}', _dark: '{colors.gray.100}' } },
          contrast: { value: { _light: 'white', _dark: '{colors.gray.900}' } },
          fg: { value: 'var(--color-content)' },
          muted: { value: 'var(--color-border)' },
          subtle: { value: 'var(--color-hover)' },
          emphasized: { value: 'var(--color-border-strong)' },
          focusRing: { value: '{colors.brand.500}' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
