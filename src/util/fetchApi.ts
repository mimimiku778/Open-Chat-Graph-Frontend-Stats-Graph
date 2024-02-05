import OpenChatChart from "../class/OpenChatChart"
import { rankingChipsToggle } from '../components/ToggleButtons';
import { setHasPotision } from '../app';
import { toggleDisplay24h } from "../components/ChartLimitBtns";

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
const BASE_URL = document.getElementById('app')?.dataset.baseUrl!

const renderChart = (chart: OpenChatChart, param: ChartApiParam, all: boolean, animation: boolean) => (data: RankingPositionChart) => {
  const isRising = param === 'rising' || param === 'rising_all'

  chart.render({
    date: data.date,
    graph1: data.member,
    graph2: data.position,
    time: data.time,
    totalCount: data.totalCount,
  }, {
    label1: 'メンバー数',
    label2: isRising
      ? (chart.getIsHour() ? '公式急上昇の順位' : '公式急上昇の最高順位')
      : (chart.getIsHour() ? '公式ランキングの順位' : '公式ランキングの最高順位'),
    category: all ? 'すべて' : category,
    isRising
  }, animation)
}

const renderMemberChart = (chart: OpenChatChart, animation: boolean) => (data: RankingPositionChart) => {
  chart.render({
    date: data.date,
    graph1: data.member,
    graph2: [],
    time: [],
    totalCount: [],
  }, {
    label1: 'メンバー数',
    label2: '',
    category
  }, animation)
}

export function fetchUpdate(chart: OpenChatChart, param: ChartApiParam, all: boolean, animation: boolean) {
  const path = chart.getIsHour() ? 'position_hour' : 'position'
  fetchApi<RankingPositionChart>(`${BASE_URL}/oc/${ocId}/${path}?sort=${param}`).then(renderChart(chart, param, all, animation))
}

export function fetchFirst(chart: OpenChatChart, param: ChartApiParam, all: boolean) {
  fetchApi<RankingPositionChart>(`${BASE_URL}/oc/${ocId}/position?sort=${param}`).then((data) => {
    if (!data.position.some(v => v !== 0 && v !== null)) {
      renderMemberChart(chart, true)(data)
      setHasPotision(false)
      toggleDisplay24h(false)
      return
    }

    if (!data.position.slice(data.position.length - 8).some(v => v !== 0 && v !== null)) {
      renderMemberChart(chart, true)(data)
      rankingChipsToggle('')
      toggleDisplay24h(false)
      return
    }

    renderChart(chart, param, all, true)(data)
  })
}

export function fetchInit(chart: OpenChatChart, animation: boolean) {
  const path = chart.getIsHour() ? 'position_hour' : 'position'
  fetchApi<RankingPositionChart>(`${BASE_URL}/oc/${ocId}/${path}?sort=ranking`).then(renderMemberChart(chart, animation))
}
