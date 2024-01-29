import { Chart as ChartJS } from 'chart.js/auto';
import OpenChatChart from "../../OpenChatChart";
import buildData from "./buildData";
import getVerticalLabelRange from "../Util/getVerticalLabelRange";
import buildOptions from "./buildOptions";
import buildPlugin from "./buildPlugin";

export default function openChatChartJSFactory(ocChart: OpenChatChart) {
  /* @ts-ignore */
  return new ChartJS(ocChart.canvas!, {
    data: buildData(ocChart),
    options: buildOptions(ocChart, getVerticalLabelRange(ocChart, ocChart.data.graph1), buildPlugin(ocChart)),
  })
}