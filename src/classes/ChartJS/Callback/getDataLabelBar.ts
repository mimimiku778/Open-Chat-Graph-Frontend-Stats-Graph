import { Context } from 'chartjs-plugin-datalabels';

export default function getDataLabelBarCallback(context: Context) {
  const min = context.chart.scales.x.min
  const max = context.chart.scales.x.max
  const index = context.dataIndex

  if (index >= min && index <= max) {
    return 'auto'
  } else {
    return false
  }
}