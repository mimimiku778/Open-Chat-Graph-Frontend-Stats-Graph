type ChartLimit = 0 | 8 | 31

type ChartRenderOption = {
  graph1: 'join' | 'delete'
  graph2: 'join' | 'delete'
}

type ChartArgs = {
  date: string[]
  graph1: number[]
  graph2: number[]
}

type OpenChatChartOption = {
  label1: string
  label2: string
}