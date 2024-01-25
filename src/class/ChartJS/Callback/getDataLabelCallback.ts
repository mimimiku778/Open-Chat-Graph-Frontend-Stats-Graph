import { Context } from 'chartjs-plugin-datalabels';
import OpenChatChart from '../../OpenChatChart';

export default function getDataLabelCallback(ocChart: OpenChatChart) {
  return (context: Context) => {
    if (!ocChart.chart) {
      return false
    }

    if (context.dataset.type === 'bar') {
      return ocChart.isPC && ocChart.limit === 31 && !context.dataset.data.some((item) => item as number >= 100)
        ? true
        : 'auto'
    }

    const min = ocChart.chart.scales.x.min
    const max = ocChart.chart.scales.x.max
    const range = max - min + 1

    const index = context.dataIndex

    const contextLen = context.dataset.data.length
    if (ocChart.chart.data.labels?.length !== contextLen) {
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
}