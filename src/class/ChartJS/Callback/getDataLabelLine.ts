import { Context } from 'chartjs-plugin-datalabels';

export default function getDataLabelLine(context: Context) {
  const min = context.chart.scales.x.min
  const max = context.chart.scales.x.max
  const range = max - min + 1

  const index = context.dataIndex

  const contextLen = context.dataset.data.length
  if (context.chart.data.labels?.length !== contextLen) {
    if (index === 0 || index === contextLen - 1) {
      return 'auto'
    } else {
      return false
    }
  }

  // 最初と最後のデータポイントのみにラベルを表示する
  if (range < 9 && index >= min && index <= max) {
    return 'auto'
  }

  if (index === min || index === max) {
    return 'auto'
  } else {
    return false
  }
}