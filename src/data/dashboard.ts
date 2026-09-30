import { Banknote, ChartLine, Ticket, TicketCheck } from 'lucide-react'
import { COLORS } from '@/config/charts'

export const SALES_STATS = [
  { label: 'Total Req. Tickets', value: 842, icon: Ticket, color: 'danger' },
  { label: 'Total Sale Tickets', value: 748, icon: TicketCheck, color: 'success' },
  { label: 'Total Profits', value: 842, icon: Banknote, color: 'primary' },
  { label: 'Total Loss', value: 748, icon: ChartLine, color: 'info' },
] as const

export const ANALYTIC = {
  booked: 60.01,
  cancelled: 30.01,
}

export const EXPENSES = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  values: [30, 40, 20, 50, 80, 60],
}

export const BOOKING_OVERVIEW = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  current: { total: '$125K', change: '+19.2%', data: [0, 40, 110, 70, 100, 60, 130, 55, 140, 125] },
  last: { total: '$59K', change: '-6.5%', data: [0, 30, 150, 40, 90, 80, 70, 45, 110, 105] },
}

export const WEATHER = {
  temperature: 27,
  date: 'Thes, Sep 20th 2021',
  city: 'Kansas City',
}

export const EARNING = {
  total: '5024.23',
  months: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  values: [80, 90, 110, 105, 90, 115, 100],
}

export interface LocationSale {
  name: string
  /** Savdo summasi, ming dollarda */
  amount: number
  color: string
}

export const SALE_BY_LOCATION: LocationSale[] = [
  { name: 'Singapore', amount: 21, color: COLORS.warning },
  { name: 'Maldives', amount: 19, color: COLORS.success },
  { name: 'Barbados', amount: 18, color: COLORS.danger },
  { name: 'Monaco', amount: 15, color: 'var(--color-primary)' },
  { name: 'Malta', amount: 12, color: 'var(--color-dark)' },
  { name: 'Palau', amount: 9, color: COLORS.info },
]
