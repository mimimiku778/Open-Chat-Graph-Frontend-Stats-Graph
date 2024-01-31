import { Chart as ChartJS } from 'chart.js/auto';
import OpenChatChart from "../../OpenChatChart";
import getVerticalLabelRange from "../Util/getVerticalLabelRange";
import { defaultVerticalLinePluginOption, hideVerticalLinePluginOption } from './verticalLinePlugin';
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

const hideTooltips = (ocChart: OpenChatChart, max: number) => {
  if (!ocChart.isPC && max + 1 === ocChart.data.date.length && ocChart.isZooming) {
    ocChart.isZooming = false
    ocChart.chart.options.plugins!.tooltip!.intersect = false;
    (ocChart.chart.options.plugins! as any).verticalLinePlugin = defaultVerticalLinePluginOption
  } else if (!ocChart.isPC && !ocChart.isZooming) {
    ocChart.isZooming = true
    ocChart.chart.options.plugins!.tooltip!.intersect = true;
    (ocChart.chart.options.plugins! as any).verticalLinePlugin = hideVerticalLinePluginOption
  }
}

const getOnZoomComplete = (ocChart: OpenChatChart) => ({ chart }: { chart: ChartJS }) => {
  const [min, max] = onZoomLabelRange(chart, ocChart)
  const range = max - min + 1

  hideTooltips(ocChart, max)

  if (range <= 8 && ocChart.zoomWeekday !== 2) {
    chart.data.labels = ocChart.getDate(8)
    ocChart.zoomWeekday = 2
  } else if (range > 8 && range < 32 && ocChart.zoomWeekday !== 1) {
    chart.data.labels = ocChart.getDate(31)
    ocChart.zoomWeekday = 1
  } else if (range >= 32 && ocChart.zoomWeekday !== 0) {
    chart.data.labels = ocChart.data.date
    ocChart.zoomWeekday = 0
  }

  chart.update('zoom')
}

export default function getZoomOption(ocChart: OpenChatChart) {
  const limit = ocChart.limit
  const enable = limit === 0

  return {
    pan: {
      enabled: enable,
      mode: 'x',
      onPanComplete({ chart }: { chart: ChartJS }) {
        onZoomLabelRange(chart, ocChart)
        chart.update('zoom')
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
      onZoomComplete: getOnZoomComplete(ocChart),

    },
    limits: {
      x: { minRange: 7 },
    },
  }
}