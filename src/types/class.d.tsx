interface ChartFactory {
  render(data: ChartArgs, option: OpenChatChartOption, animation: boolean): void
  update(limit: ChartLimit): boolean
  setIsHour(isHour: boolean, limit: ChartLimit): void
  getIsHour(): boolean
}
