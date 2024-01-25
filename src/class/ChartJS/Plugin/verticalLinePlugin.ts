import { Chart as ChartJS } from 'chart.js/auto';

export const hideVerticalLinePluginOption =
{
  lineWidth: 1,
  color: 'black',
  setLineDash: [],
}

export const verticalLinePlugin = {
  id: 'verticalLinePlugin',
  beforeEvent: (chart: ChartJS, args: any, options: any) => {
    const e = args.event
    const chartArea = chart.chartArea
    const elements = chart.getElementsAtEventForMode(e, 'nearest', { intersect: false }, true)

    if (
      elements.length > 0 &&
      e.x >= chartArea.left &&
      e.x <= chartArea.right &&
      e.y >= chartArea.top &&
      e.y <= chartArea.bottom
    ) {
      options.x = elements[0].element.x
    } else {
      options.x = NaN
    }
  },
  afterDraw: (chart: ChartJS, args: any, options: any) => {
    const ctx = chart.ctx
    const chartArea = chart.chartArea
    const x = options.x

    if (!isNaN(x)) {
      ctx.save()
      ctx.lineWidth = options.lineWidth || 1
      ctx.strokeStyle = options.color || 'black'
      ctx.setLineDash(options.setLineDash || [])
      ctx.beginPath()
      ctx.moveTo(x, chartArea.bottom)
      ctx.lineTo(x, chartArea.top)
      ctx.stroke()
      ctx.restore()
    }
  },
  defaults: {
    x: NaN,
    color: 'black',
    lineWidth: '1',
    setLineDash: [6, 6],
  },
}

export default verticalLinePlugin