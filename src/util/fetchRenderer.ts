import { categorySignal, chart, limitSignal, rankingRisingSignal } from "../signal/chartState";
import { toggleDisplay24h } from "../components/ChartLimitBtns";
import { setRenderPositionBtns } from '../app';
import fetcher from "./fetcher";

export const chatArgDto: RankingPositionChartArgDto = JSON.parse(
  (document.getElementById('chart-arg') as HTMLScriptElement).textContent!
)
export const statsDto: StatisticsChartDto = JSON.parse(
  (document.getElementById('stats-dto') as HTMLScriptElement).textContent!
)

const getApiQuery = (param: ChartApiParam, isHour: boolean) => {
  const query = {
    sort: '',
    category: '',
    start_date: isHour ? '' : statsDto.startDate,
    end_date: isHour ? '' : statsDto.endDate,
  }

  switch (param) {
    case 'ranking':
      query.sort = 'ranking'
      query.category = chatArgDto.categoryKey.toString()
      break
    case 'ranking_all':
      query.sort = 'ranking'
      query.category = '0'
      break
    case 'rising':
      query.sort = 'rising'
      query.category = chatArgDto.categoryKey.toString()
      break
    case 'rising_all':
      query.sort = 'rising'
      query.category = '0'
  }

  return new URLSearchParams(query).toString()
}

const renderChart = (param: ChartApiParam, animation: boolean, limit: ChartLimit) =>
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
      category: param.indexOf('all') !== -1 ? 'すべて' : chatArgDto.categoryName,
      isRising
    }, animation, limit)
  }

const renderMemberChart = (animation: boolean, limit: ChartLimit) =>
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
      category: chatArgDto.categoryName
    }, animation, limit)
  }

export async function fetchChart(animation: boolean) {
  const path: PotisionPath = chart.getIsHour() ? 'position_hour' : 'position'
  const limit: ChartLimit = limitSignal.value === 25 ? 31 : limitSignal.value

  // メンバーグラフのみの場合
  if (rankingRisingSignal.value === 'none') {
    chart.getIsHour()
      ? await fetcher<RankingPositionChart>(
        `${chatArgDto.baseUrl}/oc/${chatArgDto.id}/${path}?${getApiQuery('ranking', false)}`
      ).then(renderMemberChart(animation, limit))
      : renderMemberChart(animation, limit)(statsDto)
    return
  }

  const param: ChartApiParam = `${rankingRisingSignal.value}${categorySignal.value === 'all' ? '_all' : ''}`

  await fetcher<RankingPositionChart>(
    `${chatArgDto.baseUrl}/oc/${chatArgDto.id}/${path}?${getApiQuery(param, false)}`
  ).then((data) => {
    const isDefaultGraph = limitSignal.value === 8
      && rankingRisingSignal.value === 'ranking'
      && categorySignal.value === 'in'

    if (!isDefaultGraph) {
      renderChart(param, animation, limit)(data)
      return
    }

    // 順位データがない場合
    if (
      statsDto.date.length > 1
      && !data.position.some(v => v !== 0 && v !== null)
    ) {
      renderMemberChart(true, limit)(statsDto)
      setRenderPositionBtns(false)
      toggleDisplay24h.value = false
      return
    }

    // 最新１週間の順位データがない場合
    if (
      statsDto.date.length >= 8
      && !data.position.slice(data.position.length - 8, data.position.length).some(v => v !== 0 && v !== null)
    ) {
      renderMemberChart(true, limit)(statsDto)
      rankingRisingSignal.value = 'none'
      toggleDisplay24h.value = false
      return
    }

    renderChart(param, animation, limit)(data)
  })
}
