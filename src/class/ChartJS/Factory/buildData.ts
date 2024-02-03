import { ChartConfiguration } from 'chart.js/auto';
import OpenChatChart from "../../OpenChatChart";
import getPointRadius from '../Callback/getPointRadius';
import getDataLabelLine from '../Callback/getDataLabelLine';
import getDataLabelBarCallback from '../Callback/getDataLabelBar';

export const lineEasing = 'easeOutQuart'
export const barEasing = 'easeOutCirc'

export default function buildData(ocChart: OpenChatChart) {
  const data: ChartConfiguration<"bar" | "line", (number | null)[], string | string[]>['data'] = {
    labels: ocChart.data.date,
    datasets: [
      {
        type: 'line',
        label: ocChart.option.label1,
        data: ocChart.data.graph1.map(v => v !== 0 ? v : null),
        pointRadius: getPointRadius,
        fill: 'start',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(3,199,85,1)',
        borderWidth: 3,
        /* @ts-ignore */
        pointColor: '#fff',
        spanGaps: true,
        pointBackgroundColor: '#fff',
        pointStrokeColor: 'rgba(3,199,85,1)',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(3,199,85,1)',
        lineTension: 0.4,
        datalabels: {
          display: getDataLabelLine,
          align: 'end',
          anchor: 'end',
        },
        animation: {
          duration: ocChart.animation ? undefined : 0,
        },
        yAxisID: 'rainChart',
      },
    ],
  }

  if (ocChart.data.graph2.length) {
    data.datasets.push({
      type: 'bar',
      label: `${ocChart.option.label2} | ${ocChart.option.category}`,
      data: ocChart.getReverseGraph2(ocChart.data.graph2),
      backgroundColor: ocChart.option.isRising ? 'rgb(199,3,117, 0.2)' : 'rgba(3, 117, 199, 0.2)',
      datalabels: {
        align: 'start',
        anchor: 'start',
        formatter: v => {
          if (v === null) return ''
          return v ? ocChart.graph2Max - v + 1 : '圏外'
        },
        display: getDataLabelBarCallback
      },
      yAxisID: 'temperatureChart',
    })
  }

  return data
}
