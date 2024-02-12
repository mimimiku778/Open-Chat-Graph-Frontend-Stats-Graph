type RankingPositionChartArgDto = {
  id: number
  categoryKey: number
  categoryName: string
  baseUrl: string
}

type StatisticsChartDto = {
  date: string[]
  member: (number | null)[]
  startDate: string
  endDate: string
}

interface ErrorResponse {
  error: {
    code: string
    message: string
  }
}

interface RankingPositionChart {
  date: string[]
  member: (number | null)[]
  time: (string | null)[]
  position: (number | null)[]
  totalCount: (number | null)[]
}

type ToggleChart = 'rising' | 'ranking' | 'none'

type ChartApiParam = 'ranking' | 'ranking_all' | 'rising' | 'rising_all'

type urlParams = {
  category: 'in' | 'all',
  bar: ToggleChart,
  limit: 'hour' | 'week' | 'month' | 'all'
}

type urlParamsName = keyof urlParams
type urlParamsValue<T extends urlParamsName> = urlParams[T]