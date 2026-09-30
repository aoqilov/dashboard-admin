import ReactApexChart, { type Props as ApexProps } from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { mergeChartOptions } from '@/config/charts'
import { useTheme } from '@/hooks/useTheme'

type BaseChartProps = Omit<ApexProps, 'options'> & { options?: ApexOptions }

export function BaseChart({ options, width = '100%', ...props }: BaseChartProps) {
  const { theme } = useTheme()
  return <ReactApexChart options={mergeChartOptions(options, theme)} width={width} {...props} />
}
