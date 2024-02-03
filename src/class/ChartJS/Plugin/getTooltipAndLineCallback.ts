import { Chart as ChartJS } from 'chart.js/auto';
import { ChartTypeRegistry, Tooltip, TooltipPositionerFunction } from "chart.js";
import OpenChatChart from "../../OpenChatChart";

const defaultVerticalLine = {
  color: 'black',
  lineWidth: 1,
  setLineDash: [6, 6],
}

const verticalLine = (chart: ChartJS, options: {
  color: string;
  lineWidth: number;
  setLineDash: number[];
}, x: number) => {
  const ctx = chart.ctx
  const chartArea = chart.chartArea

  if (!isNaN(x) && options.lineWidth) {
    ctx.save()
    ctx.lineWidth = options.lineWidth
    ctx.strokeStyle = options.color
    ctx.setLineDash(options.setLineDash)
    ctx.beginPath()
    ctx.moveTo(x, chartArea.bottom)
    ctx.lineTo(x, chartArea.top)
    ctx.stroke()
    ctx.restore()
  }
}

export const getTooltipAndLineCallback = (ocChart: OpenChatChart): TooltipPositionerFunction<keyof ChartTypeRegistry> =>
  (elements: any, eventPosition: any) => {
    /** @ts-ignore */
    const pos = Tooltip.positioners.average(elements, eventPosition);
    if (pos === false) {
      return false;
    }

    // １周間表示時に棒グラフのデータがない場合は非表示にする
    if (
      (ocChart.limit === 8 || ocChart.zoomWeekday === 2)
      && (ocChart.data.graph2[elements[0].index] === null || !ocChart.data.graph2.length)
    ) {
      return false
    }

    !(ocChart.limit === 8 || ocChart.zoomWeekday === 2) && verticalLine(ocChart.chart, defaultVerticalLine, pos.x)

    return {
      x: pos.x,
      y: 0,
      yAlign: 'bottom',
    }
  }
