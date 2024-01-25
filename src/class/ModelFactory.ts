export default class ModelFactory {
  static initChartArgs(): ChartArgs {
    return {
      date: [],
      graph1: [],
      graph2: [],
    }
  }

  static initChartData(): ChartData {
    return {
      date: [],
      graph1: [],
      graph2: [],
    }
  }

  static initOpenChatChartOption(): OpenChatChartOption {
    return {
      label1: '',
      label2: '',
    }
  }
}
