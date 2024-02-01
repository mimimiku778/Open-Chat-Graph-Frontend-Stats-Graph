import { Chart as ChartJS } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels'
import zoomPlugin from 'chartjs-plugin-zoom'
import verticalLinePlugin from "./ChartJS/Plugin/verticalLinePlugin";
import formatDates from "./ChartJS/Util/formatDates";
import ModelFactory from "./ModelFactory.ts"
import openChatChartJSFactory from "./ChartJS/Factory/openChatChartJSFactory.ts";

export default class OpenChatChart implements ChartFactory<OpenChatChartOption> {
  chart: ChartJS = null!
  innerWidth = 0
  isPC = true
  animation = true
  initData = ModelFactory.initChartArgs()
  data = ModelFactory.initChartData()
  option = ModelFactory.initOpenChatChartOption()
  canvas?: HTMLCanvasElement
  limit: ChartLimit = 0
  zoomWeekday: 0 | 1 | 2 = 0
  isMiniMobile = false
  graph2Max = 0
  isZooming = false

  constructor(canvas: HTMLCanvasElement, defaultLimit: ChartLimit = 8) {
    ChartJS.register(ChartDataLabels)
    ChartJS.register(verticalLinePlugin)
    ChartJS.register(zoomPlugin)
    this.canvas = canvas
    this.limit = defaultLimit
    this.setSize()
    !this.isPC && this.visibilitychange()
  }

  private visibilitychange() {
    document.addEventListener('visibilitychange', () => {
      if (this.isZooming) {
        return
      }

      if (document.visibilityState === 'visible') {
        this.canvas?.getContext('2d')?.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
        this.animation = false
        this.update(this.limit)
        this.animation = true
      }

      if (document.visibilityState === 'hidden') {
        this.chart.destroy()
      }
    })
  }

  render(data: ChartArgs, option: OpenChatChartOption): void {
    if (!this.canvas) {
      throw Error('HTMLCanvasElement is not defined')
    }

    this.chart?.destroy()
    this.option = option
    this.initData = data
    this.chart = this.createChart()
  }

  updateData(data: ChartArgs, option: OpenChatChartOption): void {
    if (!this.canvas) {
      throw Error('HTMLCanvasElement is not defined')
    }

    this.animation = false
    this.render(data, option)
    this.animation = true
  }

  update(limit: ChartLimit): boolean {
    if (!this.chart) {
      return false
    }

    this.chart.destroy()
    this.limit = limit
    this.chart = this.createChart()
    return true
  }

  getCurrentLimit(): ChartLimit {
    return this.limit
  }

  destroy(): void {
    this.chart?.destroy()
    this.chart = null!
    this.initData = ModelFactory.initChartArgs()
    this.data = ModelFactory.initChartArgs()
  }

  isActive(): boolean {
    return this.chart !== null
  }

  setSize() {
    this.innerWidth = window.innerWidth
    this.isPC = this.innerWidth >= 512
    this.isMiniMobile = this.innerWidth < 360
  }

  private createChart() {
    this.isMiniMobile = this.innerWidth < 360
    this.isZooming = false
    this.zoomWeekday = 0

    const li = this.limit
    this.data = {
      date: this.getDate(this.limit),
      graph1: li ? this.initData.graph1.slice(li * -1) : this.initData.graph1,
      graph2: li ? this.initData.graph2.slice(li * -1) : this.initData.graph2,
      time: li ? this.initData.time.slice(li * -1) : this.initData.time,
      totalCount: li ? this.initData.totalCount.slice(li * -1) : this.initData.totalCount,
    }

    this.setGraph2Max(this.data.graph2)

    return openChatChartJSFactory(this)
  }

  setGraph2Max(graph2: (number | null)[]) {
    this.graph2Max = graph2.reduce((a, b) => Math.max(a === null ? 0 : a, b === null ? 0 : b), -Infinity) as number
  }

  getReverseGraph2(graph2: (number | null)[]) {
    return graph2.map(v => {
      if (v === null) return v
      return v ? this.graph2Max + 1 - v : 0
    })
  }

  getDate(limit: ChartLimit): (string | string[])[] {
    const data = this.initData.date.slice(this.limit * -1)

    if (limit === 8) {
      return formatDates(data, limit)
    } else {
      return formatDates(data, limit)
    }
  }
}