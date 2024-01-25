import { ScriptableContext } from 'chart.js/auto';
import OpenChatChart from '../../OpenChatChart';

export default function getPointRadiusCallback(ocChart: OpenChatChart) {
  return (context: ScriptableContext<"line">) => {
    if (!ocChart.chart) return 3
    
    const min = ocChart.chart.scales.x.min
    const max = ocChart.chart.scales.x.max
    const range = max - min + 1

    const index = context.dataIndex

    const contextLen = context.dataset.data.length
    if (ocChart.chart.data.labels?.length !== contextLen) {
      if (index === 0 || index === contextLen - 1) {
        return 3 // ポイントの半径を設定
      } else {
        return 0 // ポイントを非表示にする
      }
    }

    if (range < 9 && index >= min && index <= max) {
      return 3
    }

    if (index === min || index === max) {
      return 3 // ポイントの半径を設定
    } else {
      return 0 // ポイントを非表示にする
    }
  }
}
