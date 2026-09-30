import type { ApexOptions } from 'apexcharts'
import type { Theme } from '@/context/ThemeContext'
import { CHART_THEME } from './colors'

/** Barcha grafiklar uchun umumiy sozlamalar (temaga qarab) */
export function getBaseChartOptions(theme: Theme): ApexOptions {
  const { border, muted } = CHART_THEME[theme]

  return {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
      fontFamily: 'Outfit, sans-serif',
      background: 'transparent',
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: {
      borderColor: border,
      strokeDashArray: 0,
      padding: { left: 0, right: 8 },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: muted, fontSize: '10px' } },
    },
    yaxis: {
      labels: { style: { colors: muted, fontSize: '10px' } },
    },
    tooltip: { theme },
  }
}

type PlainObject = Record<string, unknown>

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Obyektlarni chuqur birlashtiradi: massivlar va funksiyalar to'liq almashtiriladi */
function deepMerge(base: PlainObject, override: PlainObject): PlainObject {
  const result: PlainObject = { ...base }
  for (const [key, value] of Object.entries(override)) {
    const baseValue = result[key]
    result[key] = isPlainObject(baseValue) && isPlainObject(value) ? deepMerge(baseValue, value) : value
  }
  return result
}

/** Umumiy sozlamalarni grafikka xos sozlamalar bilan birlashtiradi */
export function mergeChartOptions(options: ApexOptions = {}, theme: Theme): ApexOptions {
  return deepMerge(getBaseChartOptions(theme) as PlainObject, options as PlainObject) as ApexOptions
}
