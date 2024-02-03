import OpenChatChart from "../../OpenChatChart"
import getZoomOption from "../Plugin/zoomOptions"
import getTooltipLabelCallback from '../Plugin/getTooltipLabelCallback'
import { ChartType, Tooltip, TooltipPositionerFunction } from "chart.js"
import { getTooltipAndLineCallback } from "../Plugin/getTooltipAndLineCallback"

declare module 'chart.js' {
  interface TooltipPositionerMap {
    tooltipAndLine: TooltipPositionerFunction<ChartType>;
  }
}

export default function buildPlugin(ocChart: OpenChatChart): any {
  const limit = ocChart.limit
  const isLimit8 = limit === 8

  const tooltipFontSize = ocChart.isPC ? 12 : (ocChart.isMiniMobile ? 10.5 : 11)

  const datalabelFontSize =
    isLimit8 ? (ocChart.isPC ? 13 : (ocChart.isMiniMobile ? 11 : 12)) : limit === 31 ? 10.5 : (ocChart.isPC ? 11 : 10.5)

  Tooltip.positioners.tooltipAndLine = getTooltipAndLineCallback(ocChart)

  return {
    zoom: getZoomOption(ocChart),
    legend: {
      onClick: () => false,
      labels: {
        font: {
          weight: 500
        }
      }
    },
    tooltip:
    {
      intersect: false,
      titleFont: {
        size: tooltipFontSize,
      },
      mode: 'index',
      bodyFont: {
        size: tooltipFontSize,
      },
      enabled: isLimit8 && !ocChart.isPC && !ocChart.option.isRising ? false : true,
      displayColors: false,
      callbacks: {
        label: getTooltipLabelCallback(ocChart)
      },
      position: 'tooltipAndLine',
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

