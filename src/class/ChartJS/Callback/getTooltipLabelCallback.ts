import { TooltipItem } from "chart.js"
import OpenChatChart from "../../OpenChatChart"

export default function getTooltipLabelCallback(ocChart: OpenChatChart) {
  return (tooltipItem: TooltipItem<"bar" | "line">) => {
    console.log(tooltipItem.raw)
    if (tooltipItem.datasetIndex === 1) {
      if (tooltipItem.raw === null) return ''
      
      if (tooltipItem.raw === 0) return [
        ocChart.option.label2,
        ocChart.option.category,
        '圏外',
      ]

      const value = ocChart.graph2Max - (tooltipItem.raw as number) + 1
      const tip = [
        ocChart.option.label2,
        ocChart.option.category,
        `${ocChart.data.totalCount[tooltipItem.dataIndex]} 件中 ${value} 位`,
      ]

      ocChart.data.time[tooltipItem.dataIndex] && tip.push(`${ocChart.data.time[tooltipItem.dataIndex]} 時点`)
      return tip
    }

    return `メンバー ${tooltipItem.formattedValue}`
  }
}