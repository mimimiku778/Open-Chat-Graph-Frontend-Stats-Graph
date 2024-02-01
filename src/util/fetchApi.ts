import { StateUpdater } from 'preact/hooks';
import OpenChatChart from "../class/OpenChatChart"

export async function fetchApi<T,>(url: string) {
  const response = await fetch(url)
  const data: T | ErrorResponse = await response.json()
  if (!response.ok) {
    const errorMessage = (data as ErrorResponse).error.message
    console.log(errorMessage)
    throw new Error(errorMessage)
  }

  return data as T
}

const ocId = document.getElementById('app')?.dataset.ocId!
const category = document.getElementById('app')?.dataset.category!

//const BASE_URL = 'http://192.168.11.10'
const BASE_URL = 'https://openchat-review.me'

const renderChart = (chart: OpenChatChart, isRising: boolean, all: boolean) => (data: RankingPositionChart) => {
  chart.render({
    date: data.date,
    graph1: data.member,
    graph2: data.position,
    time: data.time,
    totalCount: data.totalCount,
  }, {
    label1: 'メンバー数',
    label2: isRising ? '公式急上昇の最高順位' : '公式ランキング順位',
    category: all ? 'すべて' : category,
    isRising
  })
}

const renderMemberChart = (chart: OpenChatChart) => (data: RankingPositionChart) => {
  chart.render({
    date: data.date,
    graph1: data.member,
    graph2: [],
    time: [],
    totalCount: [],
  }, {
    label1: 'メンバー数',
    label2: '',
    category,
    isRising: false
  })
}

export function fetchUpdate(chart: OpenChatChart, param: ChartApiParam, all: boolean) {
  fetchApi<RankingPositionChart>(`${BASE_URL}/oc/${ocId}/position?sort=${param}`).then(renderChart(chart, param === 'rising' || param === 'rising_all', all))
}

export function fetchFirst(chart: OpenChatChart, param: ChartApiParam, all: boolean, setHasPosition: StateUpdater<boolean>) {
  fetchApi<RankingPositionChart>(`${BASE_URL}/oc/${ocId}/position?sort=${param}`).then((data) => {
    if (data.position.some(v => v !== null)) {
      renderChart(chart, param === 'rising' || param === 'rising_all', all)(data)
      setHasPosition(true)
    } else {
      renderMemberChart(chart)(data)
      setHasPosition(false)
    }
  })
}

export function fetchInit(chart: OpenChatChart) {
  fetchApi<RankingPositionChart>(`${BASE_URL}/oc/${ocId}/position?sort=rising_all`).then(renderMemberChart(chart))
}
