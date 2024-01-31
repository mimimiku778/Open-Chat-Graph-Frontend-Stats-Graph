import { TooltipItem } from "chart.js"
import OpenChatChart from "../../OpenChatChart"

export default function getTooltipLabelCallback(ocChart: OpenChatChart) {
  return (tooltipItem: TooltipItem<"bar" | "line">) => {
    if (tooltipItem.datasetIndex === 1) {
      if (!tooltipItem.raw) return ''

      const value = ocChart.graph2Max - (tooltipItem.raw as number) + 1
      return [
        ocChart.option.label2,
        ocChart.option.category,
        `${ocChart.data.totalCount[tooltipItem.dataIndex]} 件中 ${value} 位`,
        `${ocChart.data.time[tooltipItem.dataIndex]} 時点`
      ]
    }

    return `メンバー ${tooltipItem.formattedValue}`
  }
}