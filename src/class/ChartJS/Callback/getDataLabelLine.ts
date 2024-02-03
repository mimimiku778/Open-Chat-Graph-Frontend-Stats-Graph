import { Context } from 'chartjs-plugin-datalabels';

export default function getDataLabelLine(context: Context) {
  const min = context.chart.scales.x.min
  const max = context.chart.scales.x.max
  const range = max - min + 1

  const index = context.dataIndex

  const contextLen = context.dataset.data.length
  if (context.chart.data.labels?.length !== contextLen) {
    if (index === contextLen - 1) {
      return 'auto'
    } else {
      return false
    }
  }

  // zoom,limit8
  if (range < 9 && index >= min && index <= max) {
    return true
  }

  if (index === min || index === max) {
    return 'auto'
  } else {
    return false
  }
}