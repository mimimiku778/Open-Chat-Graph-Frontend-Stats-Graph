import { ChartConfiguration, Chart as ChartJS } from 'chart.js/auto'
import OpenChatChart from "../../OpenChatChart"
import horizontalLabelFontColorCallback from "../Callback/horizontalLabelFontColorCallback"
import getVerticalLabelRange from '../Util/getVerticalLabelRange'
import getRankingBarLabelRange from '../Util/getRankingBarLabelRange'

const aspectRatio = (ocChart: OpenChatChart) => {
  ocChart.setSize()
  return ocChart.isMiniMobile ? 1 / 1 : ocChart.isPC ? 1.7 / 1 : 1.2 / 1
}

export default function buildOptions(ocChart: OpenChatChart, plugins: any)
  : ChartConfiguration<"bar" | "line", number[], string | string[]>['options'] {
  const limit = ocChart.limit
  const isWeekly = limit === 8

  const ticksFontSizeMobile = ocChart.isMiniMobile ? 11 : 12

  const ticksFontSize =
    isWeekly
      ? ocChart.isPC
        ? 13
        : ticksFontSizeMobile
      : limit === 31
        ? ocChart.isPC
          ? 11
          : 10.5
        : ocChart.isPC
          ? 13
          : 10.5

  const dataFontSize = ocChart.isPC ? 13 : ticksFontSizeMobile

  const paddingX = 17
  const paddingY = isWeekly ? 0 : 5
  const displayY = !isWeekly

  const labelRangeLine = getVerticalLabelRange(ocChart, ocChart.data.graph1)

  const options: ChartConfiguration<"bar" | "line", number[], string | string[]>['options'] = {
    animation: {
      duration: ocChart.animation ? 1000 : 0,

    },
    layout: {
      padding: {
        left: 0,
        top: 0,
      },
    },
    onResize: (chart: ChartJS) => {
      chart.options.aspectRatio = aspectRatio(ocChart)
      chart.resize()
    },
    aspectRatio: aspectRatio(ocChart),
    scales: {
      x: {
        ticks: {
          color: horizontalLabelFontColorCallback,
          padding: paddingX,
          autoSkip: true,
          maxRotation: 90,
          font: {
            size: ticksFontSize,
          },
        },
      },
      rainChart: {
        position: 'left',
        min: labelRangeLine.dataMin,
        max: labelRangeLine.dataMax,
        display: displayY,
        ticks: {
          callback: (v: any) => {
            if (v === null) return ''
            return v
          },
          stepSize: labelRangeLine.stepSize,
          precision: 0,
          autoSkip: true,
          padding: paddingY,
          font: {
            size: dataFontSize,
          },
        },
      },
    },
    plugins
  }

  if (ocChart.data.graph2.length) {
    const labelRangeBar = getRankingBarLabelRange(ocChart, ocChart.getReverseGraph2(ocChart.data.graph2))

    options.scales!.temperatureChart! = {
      position: 'right',
      min: labelRangeBar.dataMin,
      max: labelRangeBar.dataMax,
      display: displayY,
      grid: {
        display: false,
      },
      ticks: {
        callback: (v: any) => {
          if (v === null) return ''
          const value = ocChart.graph2Max - v + 1
          return value <= ocChart.graph2Max ? `${Math.ceil(value)} 位` : ''
        },
        stepSize: labelRangeBar.stepSize,
        precision: 0,
        autoSkip: true,
        font: {
          size: dataFontSize,
        },
      },
    }
  }

  return options
}