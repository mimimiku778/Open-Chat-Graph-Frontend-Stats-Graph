import { TooltipItem } from 'chart.js/auto'
import OpenChatChart from "../../OpenChatChart"
import getDataLabelCallback from "../Callback/getDataLabelCallback"
import { hideVerticalLinePluginOption } from "../Plugin/verticalLinePlugin"
import getZoomOption from "../Plugin/zoomOptions"

export default function buildPlugin(ocChart: OpenChatChart): any {
  const limit = ocChart.limit
  const ticksFontSizeMobile = ocChart.isMiniMobile ? 11 : 12
  const dataFontSize = ocChart.isPC ? 13 : ticksFontSizeMobile
  const verticalLine = limit !== 8

  const datalabelFontSize =
    limit === 8 ? (ocChart.isPC ? 13 : ticksFontSizeMobile) : limit === 31 ? 10.5 : ocChart.isPC ? 11 : 10.5

  return {
    zoom: getZoomOption(ocChart),
    verticalLinePlugin: hideVerticalLinePluginOption,
    legend: {
      display: true,
    },
    tooltip:
      ocChart.isPC || ocChart.limit
        ? {
          titleFont: {
            size: dataFontSize,
          },
          bodyFont: {
            size: dataFontSize,
          },
          enabled: verticalLine,
          mode: 'nearest',
          intersect: false,
          displayColors: false,
          callbacks: {
            label: (tooltipItem: TooltipItem<"bar" | "line">) => {
              return tooltipItem.formattedValue
            },
          },
        }
        : undefined,
    datalabels: {
      clip: false,
      borderRadius: 4,
      display: getDataLabelCallback(ocChart),
      color: 'black',
      backgroundColor: 'rgba(0,0,0,0)',
      font: {
        size: datalabelFontSize,
        weight: 'bold',
      },
    },
  }
}
