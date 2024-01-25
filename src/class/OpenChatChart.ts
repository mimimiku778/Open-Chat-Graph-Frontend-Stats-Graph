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
  zoomWeekday = false
  isMiniMobile = false

  constructor() {
    ChartJS.register(ChartDataLabels)
    ChartJS.register(verticalLinePlugin)
    ChartJS.register(zoomPlugin)
  }

  init(canvas: HTMLCanvasElement, defaultLimit: ChartLimit) {
    this.canvas = canvas
    this.limit = defaultLimit
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

  private createChart() {
    this.innerWidth = window.innerWidth
    this.isPC = this.innerWidth >= 600
    this.isMiniMobile = this.innerWidth <= 360

    const li = this.limit
    this.data = {
      date: li ? this.getDate(this.limit) : this.initData.date,
      graph1: li ? this.initData.graph1.slice(li * -1) : this.initData.graph1,
      graph2: li ? this.initData.graph2.slice(li * -1) : this.initData.graph2,
    }

    return openChatChartJSFactory(this)
  }

  getDate(limit: ChartLimit): (string | string[])[] {
    const data = this.initData.date.slice(this.limit * -1)
    
    if (limit === 8) {
      return formatDates(data)
    } else {
      return formatDates(data, true)
    }
  }
}