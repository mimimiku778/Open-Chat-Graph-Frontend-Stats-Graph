import { signal } from "@preact/signals"
import { chatArgDto, fetchChart, statsDto } from "../util/fetchRenderer"
import OpenChatChart from "../classes/OpenChatChart"
import { getCurrentUrlParams, setUrlParams } from "../util/urlParam"
import { toggleDisplayAll, toggleDisplayMonth } from "../components/ChartLimitBtns"

export const chart = new OpenChatChart(document.getElementById('chart-preact-canvas') as HTMLCanvasElement)
export const toggleShowCategorySignal = signal(true)
export const rankingRisingSignal = signal<ToggleChart>('ranking')
export const categorySignal = signal<urlParamsValue<'category'>>('in')
export const limitSignal = signal<ChartLimit | 25>(8)

export function setChartStatesFromUrlParams() {
  const params = getCurrentUrlParams()
  rankingRisingSignal.value = params.bar
  categorySignal.value = params.category

  switch (params.limit) {
    case "hour":
      limitSignal.value = 25
      chart.setIsHour(true)
      break
    case "week":
      limitSignal.value = 8
      break
    case "month":
      limitSignal.value = 31
      break
    case "all":
      limitSignal.value = 0
      break
  }
}

export function setUrlParamsFromChartStates() {
  let limit: urlParamsValue<'limit'> = 'hour'
  switch (limitSignal.value) {
    case 8:
      limit = 'week'
      break
    case 31:
      limit = 'month'
      break
    case 0:
      limit = 'all'
      break
  }

  setUrlParams({ bar: rankingRisingSignal.value, category: categorySignal.value, limit })
}

export function initDisplay() {
  // カテゴリがその他の場合
  if (!chatArgDto.categoryKey) {
    toggleShowCategorySignal.value = false
    categorySignal.value = 'all'
    rankingRisingSignal.value = 'rising'
  }

  // 最新１週間のデータがない場合
  if (statsDto.date.length <= 8) {
    toggleDisplayMonth.value = false
  }

  // 最新1ヶ月のデータがない場合
  if (statsDto.date.length <= 31) {
    toggleDisplayAll.value = false
  }
}

export function handleChangeLimit(limit: ChartLimit | 25) {
  limitSignal.value = limit

  if (limit === 25) {
    chart.setIsHour(true)
    fetchChart(true)
  } else if (chart.getIsHour()) {
    chart.setIsHour(false)
    fetchChart(true)
  } else {
    chart.update(limit)
  }
  
  setUrlParamsFromChartStates()
}

export function handleChangeCategory(alignment: urlParamsValue<'category'> | null) {
  if (!alignment) return
  categorySignal.value = alignment
  fetchChart(false)
  setUrlParamsFromChartStates()
}

export function handleChangeRankingRising(alignment: ToggleChart) {
  rankingRisingSignal.value = alignment
  fetchChart(false)
  setUrlParamsFromChartStates()
}