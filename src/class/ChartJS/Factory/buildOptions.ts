import { ChartConfiguration, Chart as ChartJS } from 'chart.js/auto'
import OpenChatChart from "../../OpenChatChart"
import getVerticalLabelRange from '../Util/getVerticalLabelRange'
import getRankingBarLabelRange from '../Util/getRankingBarLabelRange'
import getHorizontalLabelFontColor from '../Callback/getHorizontalLabelFontColor'
import { getHourTicksFormatterCallback } from '../Callback/getHourTicksFormatterCallback'

const aspectRatio = (ocChart: OpenChatChart) => {
  ocChart.setSize()
  return ocChart.isMiniMobile ? 1.1 / 1 : ocChart.isPC ? 1.7 / 1 : 1.2 / 1
}

export default function buildOptions(ocChart: OpenChatChart, plugins: any)
  : ChartConfiguration<"bar" | "line", number[], string | string[]>['options'] {
  const hasPosition = !!ocChart.data.graph2.length
  const limit = ocChart.limit
  const isWeekly = limit === 8

  ChartJS.defaults.borderColor = isWeekly ? 'rgba(0,0,0,0)' : '#efefef';


  const ticksFontSizeMobile = ocChart.isMiniMobile ? 11 : 12

  const ticksFontSize =
    isWeekly
      ? ocChart.isPC
        ? 13
        : ticksFontSizeMobile
      : limit === 31
        ? ocChart.isPC
          ? (ocChart.getIsHour() ? 12 : 11)
          : (ocChart.getIsHour() ? 11.5 : 10.5)
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
      duration: ocChart.animationAll ? undefined : 0,
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
        grid: {
          display: hasPosition ? displayY : true,
          color: '#efefef'
        },
        ticks: {
          color: getHorizontalLabelFontColor,
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
            if (v === 0) return 1
            return v
          },
          stepSize: labelRangeLine.stepSize,
          precision: 0,
          autoSkip: true,
          padding: paddingY,
          font: {
            size: dataFontSize,
          },
          color: '#777',
        },

      },
    },
    plugins
  }

  // 最新24時間の場合のticksフォーマッター
  if (ocChart.getIsHour()) {
    options.scales!.x!.ticks!.callback = getHourTicksFormatterCallback(ocChart)
  }

  if (ocChart.data.graph2.length) {
    const labelRangeBar = getRankingBarLabelRange(ocChart, ocChart.getReverseGraph2(ocChart.data.graph2))
    const show = displayY && (ocChart.data.graph2.some(v => v !== 0 && v !== null))

    let lastTick = 0

    options.scales!.temperatureChart! = {
      position: 'right',
      min: labelRangeBar.dataMin,
      max: labelRangeBar.dataMax,
      display: show,
      grid: {
        display: false,
      },
      ticks: {
        display: show,
        callback: (v: any) => {
          const value = ocChart.graph2Max - v + 1
          let tick = Math.ceil(value)

          if (tick === lastTick) return ''
          lastTick = tick

          return `${tick} 位`
        },
        stepSize: labelRangeBar.stepSize,
        autoSkip: true,
        maxTicksLimit: 14,
        font: {
          size: dataFontSize,
        },
        color: '#777',
      },
    }
  }

  return options
}