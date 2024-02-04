import { ChartConfiguration } from 'chart.js/auto';
import OpenChatChart from "../../OpenChatChart";
import getPointRadius from '../Callback/getPointRadius';
import getDataLabelLine from '../Callback/getDataLabelLine';
import getDataLabelBarCallback from '../Callback/getDataLabelBar';
import getLineGradient from '../Callback/getLineGradient';
import getLineGradientBar from '../Callback/getLineGradientBar';

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
        fill: false,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This case happens on initial chart load
            return;
          }
          return getLineGradient(ctx, chartArea);
        },
        borderWidth: 3,
        spanGaps: true,
        pointBackgroundColor: '#fff',
        /* @ts-ignore */
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
      //backgroundColor: ocChart.option.isRising ? 'rgba(235, 80, 242, 0.2)' : 'rgba(22, 194, 193, 0.2)',
      backgroundColor: function (context) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
          // This case happens on initial chart load
          return;
        }
        return getLineGradientBar(ctx, chartArea);
      },
      barPercentage: ocChart.limit === 8 ? 0.77 : 0.9,
      borderRadius: ocChart.limit === 8 || ocChart.data.date.length < 10 ? 4 : 2,
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
