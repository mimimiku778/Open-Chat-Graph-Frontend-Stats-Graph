import { TooltipItem } from 'chart.js/auto'
import OpenChatChart from "../../OpenChatChart"
import { hideVerticalLinePluginOption } from "../Plugin/verticalLinePlugin"
import getZoomOption from "../Plugin/zoomOptions"

export default function buildPlugin(ocChart: OpenChatChart): any {
  const limit = ocChart.limit
  const ticksFontSizeMobile = ocChart.isMiniMobile ? 11 : 12
  const dataFontSize = ocChart.isPC ? 13 : ticksFontSizeMobile
  const verticalLine = limit === 31

  const datalabelFontSize =
    limit === 8 ? (ocChart.isPC ? 13 : ticksFontSizeMobile) : limit === 31 ? 10.5 : ocChart.isPC ? 11 : 10.5

  return {
    zoom: getZoomOption(ocChart),
    verticalLinePlugin: ocChart.isPC || verticalLine ? undefined : hideVerticalLinePluginOption,
    legend: {
      display: true,
    },
    tooltip:
    {
      usePointStyle: true,
      intersect: ocChart.isPC ? true : !verticalLine,
      titleFont: {
        size: dataFontSize,
      },
      bodyFont: {
        size: dataFontSize,
      },
      enabled: true,
      mode: 'nearest',
      displayColors: false,

      callbacks: {
        label: (tooltipItem: TooltipItem<"bar" | "line">) => {
          if (tooltipItem.datasetIndex === 1) {
            const value = tooltipItem.raw ? ocChart.graph2Max - (tooltipItem.raw as number) + 1 : '圏外'
            return [ocChart.option.label2, `${value} 位`]
          }

          return [ocChart.option.label1, `${tooltipItem.formattedValue} 人`]
        }
      },
    },
    datalabels: {
      borderRadius: 4,
      color: 'black',
      backgroundColor: 'rgba(0,0,0,0)',
      font: {
        size: datalabelFontSize,
        weight: 'bold',
      },
    },
  }
}
