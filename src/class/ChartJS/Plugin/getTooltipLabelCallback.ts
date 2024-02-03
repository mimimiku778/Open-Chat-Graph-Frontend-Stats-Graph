import { TooltipItem } from "chart.js"
import OpenChatChart from "../../OpenChatChart"

export default function getTooltipLabelCallback(ocChart: OpenChatChart) {
  return (tooltipItem: TooltipItem<"bar" | "line">) => {
    if (tooltipItem.datasetIndex === 1) {
      if (tooltipItem.raw === null) return ''

      if (tooltipItem.raw === 0) return `圏外`

      const value = ocChart.graph2Max - (tooltipItem.raw as number) + 1
      const tip = `${value} 位 (${ocChart.data.totalCount[tooltipItem.dataIndex]} 件中)`

      if (ocChart.data.time[tooltipItem.dataIndex]) return `${tip} ${ocChart.data.time[tooltipItem.dataIndex]} 時点`
      return tip
    }

    // １周間表示時はメンバー数を非表示にする
    return (ocChart.limit === 8 || ocChart.zoomWeekday === 2) && !ocChart.data.graph2.length
      ? ''
      : `メンバー ${tooltipItem.formattedValue}`
  }
}