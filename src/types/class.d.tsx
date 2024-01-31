interface ChartFactory<T> {
  render(data: ChartArgs, option: OpenChatChartOption): void
  updateData(data: ChartArgs, option: T): void
  update(limit: ChartLimit): boolean
  destroy(): void
  isActive(): boolean
  getCurrentLimit(): ChartLimit
}
