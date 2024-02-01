import OpenChatChart from "../../OpenChatChart"
import { hideVerticalLinePluginOption } from "../Plugin/verticalLinePlugin"
import getZoomOption from "../Plugin/zoomOptions"
import getTooltipLabelCallback from '../Callback/getTooltipLabelCallback'

export default function buildPlugin(ocChart: OpenChatChart): any {
  const limit = ocChart.limit
  const ticksFontSizeMobile = ocChart.isMiniMobile ? 11 : 12
  const dataFontSize = ocChart.isPC ? 13 : ticksFontSizeMobile

  const datalabelFontSize =
    limit === 8 ? (ocChart.isPC ? 13 : ticksFontSizeMobile) : limit === 31 ? 10.5 : ocChart.isPC ? 11 : 10.5

  return {
    zoom: getZoomOption(ocChart),
    verticalLinePlugin: limit === 8 ? hideVerticalLinePluginOption : undefined,
    legend: {
      onClick: () => false
    },
    tooltip:
    {
      usePointStyle: true,
      intersect: limit === 8,
      titleFont: {
        size: dataFontSize,
      },
      bodyFont: {
        size: dataFontSize,
      },
      enabled: true,
      displayColors: false,
      callbacks: {
        beforeBody: (tooltipItem: any) => {
          if (!tooltipItem.raw) return ''
        },
        label: getTooltipLabelCallback(ocChart)
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
