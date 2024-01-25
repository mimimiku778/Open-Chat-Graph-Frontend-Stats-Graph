interface ChartFactory<T> {
  init(canvas: HTMLCanvasElement, defaultLimit: ChartLimit): void
  render(data: ChartArgs, option: T): void
  updateData(data: ChartArgs, option: T): void
  update(limit: ChartLimit): boolean
  destroy(): void
  isActive(): boolean
  getCurrentLimit(): ChartLimit
}
