import { useEffect } from 'preact/hooks'
import OpenChatChart from './classes/OpenChatChart'
import { chatArgDto, fetchFirstDefault, fetchInit, fetchUpdate } from './util/fetchRenderer'
import ChartLimitBtns from './components/ChartLimitBtns'
import ToggleButtons, { toggleDisplayCategory } from './components/ToggleButtons'
import { signal } from '@preact/signals'

const chart = new OpenChatChart(document.getElementById('chart-preact-canvas') as HTMLCanvasElement)
const renderTab = signal(false)
const renderPositionBtns = signal(false)

export const chipsSignal = signal<ToggleChart>('ranking')
export const cateSignal = signal<'cate' | 'all'>('cate')
export const limitBtnsSignal = signal<ChartLimit | 25>(8)

export const setRenderTab = () => {
  renderTab.value = true
}

export const setRenderPositionBtns = (toggle: boolean) => {
  renderPositionBtns.value = toggle
  if (!toggle) document.getElementById('app')!.style.height = '49px'
}

export const rankingChipsToggle = (toggle: ToggleChart) => {
  chipsSignal.value = toggle
}

export const fetchChart = (animation: boolean) => {
  const isAll = cateSignal.value === 'all'

  if (chipsSignal.value === 'none') {
    fetchInit(chart, animation)
  } else {
    fetchUpdate(chart, `${chipsSignal.value}${isAll ? '_all' : ''}`, animation)
  }
}

export const handleChangeLimit = (limit: ChartLimit | 25) => {
  limitBtnsSignal.value = limit

  const isHour = limit === 25
  if (isHour) {
    chart.setIsHour(isHour, 31)
    fetchChart(true)
  } else if (chart.getIsHour()) {
    chart.setIsHour(isHour, limit)
    fetchChart(true)
  } else {
    chart.setIsHour(null)
    chart.update(limit)
  }
}

export const handleChangeCategory = (alignment: 'cate' | 'all' | null) => {
  if (!alignment) return
  cateSignal.value = alignment
  fetchChart(false)
}

export const handleChangeRankingRising = (alignment: ToggleChart) => () => {
  rankingChipsToggle(alignment)
  fetchChart(false)
}

const init = async () => {
  const hasCategory = !!chatArgDto.categoryKey
  toggleDisplayCategory(hasCategory)
  
  await fetchFirstDefault(chart, hasCategory ? 'ranking' : 'rising')
}

export function App() {
  useEffect(() => {
    init()
  }, [])

  return (
    <div>
      <div style="min-height: 49px">{renderTab.value && <ChartLimitBtns />}</div>
      <div style="min-height: 68px">{renderPositionBtns.value && <ToggleButtons />}</div>
    </div>
  )
}
