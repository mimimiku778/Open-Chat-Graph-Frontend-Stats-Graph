import { ScriptableContext } from 'chart.js/auto';

export default function getPointRadius(context: ScriptableContext<"line">) {
  const min = context.chart.scales.x.min
  const max = context.chart.scales.x.max
  const range = max - min + 1

  const index = context.dataIndex

  const contextLen = context.dataset.data.length
  if (context.chart.data.labels?.length !== contextLen) {
    if (index === contextLen - 1) {
      return 3 // ポイントの半径を設定
    } else {
      return 0 // ポイントを非表示にする
    }
  }

  // zoom,limit8
  if (range < 9 && index >= min && index <= max) {
    return 3
  }

  if (index === min || index === max) {
    return 3 // ポイントの半径を設定
  } else {
    return 0 // ポイントを非表示にする
  }
}

