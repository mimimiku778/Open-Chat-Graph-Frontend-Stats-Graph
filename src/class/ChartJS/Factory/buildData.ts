import { ChartConfiguration } from 'chart.js/auto';
import getPointRadiusCallback from "../Callback/getPointRadiusCallback";
import OpenChatChart from "../../OpenChatChart";

export default function buildData(ocChart: OpenChatChart)
  : ChartConfiguration<"bar" | "line", number[], string | string[]>['data'] {
  return {
    labels: ocChart.data.date,
    datasets: [
      {
        type: 'line',
        label: ocChart.option.label1,
        data: ocChart.data.graph1,
        pointRadius: getPointRadiusCallback(ocChart),
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
        clip: undefined,
        datalabels: {
          align: 'end',
          anchor: 'end',
        },
        yAxisID: 'rainChart',
      },
      {
        type: 'bar',
        label: ocChart.option.label2,
        data: ocChart.data.graph2,
        backgroundColor: 'rgb(199,3,117, 0.2)',
        clip: undefined,
        datalabels: {
          align: 'start',
          anchor: 'start',
        },
        yAxisID: 'temperatureChart',
      },
    ],
  }
}
