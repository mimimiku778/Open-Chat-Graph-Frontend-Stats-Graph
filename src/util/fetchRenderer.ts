import OpenChatChart from "../classes/OpenChatChart"
import { rankingChipsToggle } from '../components/ToggleButtons';
import { setHasPotision, setRenderTab } from '../app';
import { toggleDisplay24h, toggleDisplayAll, toggleDisplayMonth } from "../components/ChartLimitBtns";
import fetcher from "./fetcher";

export const chatArgDto: RankingPositionChartArgDto = JSON.parse(
  (document.getElementById('chart-arg') as HTMLScriptElement).textContent!
)

const statsDto: StatisticsChartDto = JSON.parse(
  (document.getElementById('stats-dto') as HTMLScriptElement).textContent!
)

const OC_ID = chatArgDto.id
const CATEGORY_NAME = chatArgDto.categoryName
const CATEGORY_KEY = chatArgDto.categoryKey
const BASE_URL = chatArgDto.baseUrl

const START_DATE = statsDto.startDate
const END_DATE = statsDto.endDate

const renderChart = (chart: OpenChatChart, param: ChartApiParam, all: boolean, animation: boolean) =>
  (data: RankingPositionChart) => {
    const isRising = param === 'rising' || param === 'rising_all'

    chart.render({
      date: data.date.length ? data.date : statsDto.date,
      graph1: data.member.length ? data.member : statsDto.member,
      graph2: data.position,
      time: data.time,
      totalCount: data.totalCount,
    }, {
      label1: 'メンバー数',
      label2: isRising
        ? (chart.getIsHour() ? '公式急上昇の順位' : '公式急上昇の最高順位')
        : (chart.getIsHour() ? '公式ランキングの順位' : '公式ランキングの順位'),
      category: all ? 'すべて' : CATEGORY_NAME,
      isRising
    }, animation)
  }

const renderMemberChart = (chart: OpenChatChart, animation: boolean) =>
  (data: RankingPositionChart | StatisticsChartDto) => {
    chart.render({
      date: data.date,
      graph1: data.member,
      graph2: [],
      time: [],
      totalCount: [],
    }, {
      label1: 'メンバー数',
      label2: '',
      category: CATEGORY_NAME
    }, animation)
  }

const getQueryString = (param: ChartApiParam, isHour: boolean) => {
  const query = {
    sort: '',
    category: '',
    start_date: isHour ? '' : START_DATE,
    end_date: isHour ? '' : END_DATE,
  }

  switch (param) {
    case 'ranking':
      query.sort = 'ranking'
      query.category = CATEGORY_KEY.toString()
      break
    case 'ranking_all':
      query.sort = 'ranking'
      query.category = '0'
      break
    case 'rising':
      query.sort = 'rising'
      query.category = CATEGORY_KEY.toString()
      break
    case 'rising_all':
      query.sort = 'rising'
      query.category = '0'
  }

  return new URLSearchParams(query).toString()
}

const getPositionPath = (isHour: boolean) => isHour ? 'position_hour' : 'position'

export function fetchUpdate(chart: OpenChatChart, param: ChartApiParam, all: boolean, animation: boolean) {
  const isHour = chart.getIsHour()
  const path = getPositionPath(isHour)
  fetcher<RankingPositionChart>(`${BASE_URL}/oc/${OC_ID}/${path}?${getQueryString(param, isHour)}`).then(renderChart(chart, param, all, animation))
}

export function fetchFirst(chart: OpenChatChart, param: ChartApiParam, all: boolean) {
  fetcher<RankingPositionChart>(`${BASE_URL}/oc/${OC_ID}/position?${getQueryString(param, false)}`).then((data) => {
    setRenderTab()
    setHasPotision(true)

    // 最新１週間のデータがない場合
    if (statsDto.date.length <= 8) {
      toggleDisplayMonth(false)
    }

    // 最新1ヶ月のデータがない場合
    if (statsDto.date.length <= 31) {
      toggleDisplayAll(false)
    }

    // 順位データがない場合
    if (statsDto.date.length > 1 && !data.position.some(v => v !== 0 && v !== null)) {
      renderMemberChart(chart, true)(statsDto)
      setHasPotision(false)
      toggleDisplay24h(false)
      return
    }

    // 最新１週間の順位データがない場合
    if (statsDto.date.length >= 8 && !data.position.slice(data.position.length - 8, data.position.length).some(v => v !== 0 && v !== null)) {
      renderMemberChart(chart, true)(statsDto)
      rankingChipsToggle('')
      toggleDisplay24h(false)
      return
    }

    renderChart(chart, param, all, true)(data)
  })
}

export function fetchInit(chart: OpenChatChart, animation: boolean) {
  const path = getPositionPath(chart.getIsHour())
  path === 'position'
    ? renderMemberChart(chart, animation)(statsDto)
    : fetcher<RankingPositionChart>(`${BASE_URL}/oc/${OC_ID}/${path}?${getQueryString('ranking', false)}`).then(renderMemberChart(chart, animation))
}
