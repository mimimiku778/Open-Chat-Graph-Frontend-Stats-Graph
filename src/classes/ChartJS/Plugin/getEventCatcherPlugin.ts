import {  Chart as ChartJS } from 'chart.js/auto';
import OpenChatChart from "../../OpenChatChart"
import { resetTooltip } from './zoomOptions';

let inChartArea = false;

/** @ts-ignore */
export default function getEventCatcherPlugin(ocChart: OpenChatChart) {
  return {
    id: 'myEventCatcher',
    /** @ts-ignore */
    beforeEvent(chart: ChartJS, args) {
      if (inChartArea && !args.inChartArea) {
        // チャートエリア外イベントでツールチップ非表示
        resetTooltip(ocChart)
        ocChart.chart.update()
      }

      if (args.inChartArea) inChartArea = true
      if (!args.inChartArea) inChartArea = false
    }
  }
}