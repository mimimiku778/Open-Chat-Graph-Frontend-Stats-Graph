import { Chart as ChartJS } from 'chart.js/auto';
import OpenChatChart from "../../OpenChatChart";
import getVerticalLabelRange from "../Util/getVerticalLabelRange";
import getRankingBarLabelRange from '../Util/getRankingBarLabelRange';

const onZoomLabelRange = (chart: ChartJS, ocChart: OpenChatChart) => {
  const min = chart.scales.x.min
  const max = chart.scales.x.max
  const { dataMin, dataMax, stepSize } = getVerticalLabelRange(ocChart, ocChart.data.graph1.slice(min, max + 1))

  chart.options!.scales!.rainChart!.min = dataMin
  chart.options!.scales!.rainChart!.max = dataMax;
  (chart.options!.scales!.rainChart!.ticks as any).stepSize = stepSize

  if (ocChart.data.graph2.length) {
    const graph2 = ocChart.data.graph2.slice(min, max + 1)
    ocChart.setGraph2Max(graph2)

    const graph2Reverse = ocChart.getReverseGraph2(graph2)
    const { dataMin, dataMax, stepSize } = getRankingBarLabelRange(ocChart, graph2Reverse)

    chart.data.datasets[1].data = ocChart.getReverseGraph2(ocChart.data.graph2)

    chart.options!.scales!.temperatureChart!.min = dataMin
    chart.options!.scales!.temperatureChart!.max = dataMax;
    (chart.options!.scales!.temperatureChart!.ticks as any).stepSize = stepSize
  }

  return [min, max]
}

const resetTooltip = (ocChart: OpenChatChart) => {
  ocChart.chart.tooltip!.setActiveElements([], { x: 0, y: 0 });
}

const getOnZoomComplete = (ocChart: OpenChatChart) => {
  const [min, max] = onZoomLabelRange(ocChart.chart, ocChart)
  const range = max - min + 1

  if (range <= 8 && ocChart.zoomWeekday !== 2) {
    ocChart.chart.data.labels = ocChart.getDate(8)
    ocChart.zoomWeekday = 2
  } else if (range > 8 && range < 32 && ocChart.zoomWeekday !== 1) {
    ocChart.chart.data.labels = ocChart.getDate(31)
    ocChart.zoomWeekday = 1
  } else if (range >= 32 && ocChart.zoomWeekday !== 0) {
    ocChart.chart.data.labels = ocChart.data.date
    ocChart.zoomWeekday = 0
  }
}

export default function getZoomOption(ocChart: OpenChatChart) {
  const limit = ocChart.limit
  const enable = limit === 0

  return {
    pan: {
      enabled: enable,
      mode: 'x',
      onPanStart: () => {
        resetTooltip(ocChart)
      },
      onPanComplete: () => {
        onZoomLabelRange(ocChart.chart, ocChart)
        resetTooltip(ocChart)
        ocChart.chart.update()
      },
    },
    zoom: {
      pinch: {
        enabled: enable,
      },
      wheel: {
        enabled: enable,
      },
      mode: 'x',
      onZoomStart: () => {
        resetTooltip(ocChart)
      },
      onZoomComplete: () => {
        getOnZoomComplete(ocChart)
        resetTooltip(ocChart)
        ocChart.chart.update()
      },
    },
    limits: {
      x: { minRange: 7 },
    },
  }
}