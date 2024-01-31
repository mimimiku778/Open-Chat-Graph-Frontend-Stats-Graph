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

type ToggleChart = 'rising' | 'ranking' | ''

type ChartApiParam = 'ranking' | 'ranking_all' | 'rising' | 'rising_all'