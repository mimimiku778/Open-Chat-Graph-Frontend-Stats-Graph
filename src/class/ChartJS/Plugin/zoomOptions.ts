import { Chart as ChartJS } from 'chart.js/auto';
import OpenChatChart from "../../OpenChatChart";
import getVerticalLabelRange from "../Util/getVerticalLabelRange";

const onZoomLabelRange = (chart: ChartJS, ocChart: OpenChatChart) => {
  const min = chart.scales.x.min
  const max = chart.scales.x.max
  const { dataMin, dataMax, stepSize } = getVerticalLabelRange(ocChart)

  chart.options!.scales!.rainChart!.min = dataMin
  chart.options!.scales!.rainChart!.max = dataMax;
  (chart.options!.scales!.rainChart!.ticks as any).stepSize = stepSize

  return [min, max]
}

const getOnZoomComplete = (ocChart: OpenChatChart) => ({ chart }: { chart: ChartJS }) => {
  const [min, max] = onZoomLabelRange(chart, ocChart)
  const range = max - min + 1

  if (range <= 8 && ocChart.zoomWeekday) {
    chart.data.labels = ocChart.getDate(8)
    ocChart.zoomWeekday! = false
  } else if (range < 32 && !ocChart.zoomWeekday) {
    chart.data.labels = ocChart.getDate(31)
    ocChart.zoomWeekday! = true
  } else if (range >= 32 && ocChart.zoomWeekday) {
    chart.data.labels = ocChart.data.date
    ocChart.zoomWeekday! = false
  }

  chart.update()
}

export default function getZoomOption(ocChart: OpenChatChart) {
  return {
    pan: {
      enabled: true,
      mode: 'x',
      onPanComplete({ chart }: { chart: ChartJS }) {
        onZoomLabelRange(chart, ocChart)
        chart.update()
      },
    },
    zoom: {
      pinch: {
        enabled: true,
      },
      wheel: {
        enabled: true,
      },
      mode: 'x',
      onZoomComplete: getOnZoomComplete(ocChart),
    },
    limits: {
      x: { minRange: 7 },
    },
  }
}