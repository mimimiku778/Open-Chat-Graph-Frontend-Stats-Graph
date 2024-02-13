import { useEffect } from 'preact/hooks'
import ChartLimitBtns from './components/ChartLimitBtns'
import ToggleButtons from './components/ToggleButtons'
import { signal } from '@preact/signals'
import { initDisplay, setChartStatesFromUrlParams, setUrlParamsFromChartStates } from './signal/chartState'
import { fetchChart } from './util/fetchRenderer'

export const renderTab = signal(false)
const renderPositionBtns = signal(false)

export const setRenderPositionBtns = (toggle: boolean) => {
  renderPositionBtns.value = toggle
  if (!toggle) document.getElementById('app')!.style.height = '49px'
}

const init = async () => {
  setChartStatesFromUrlParams()
  initDisplay()
  await fetchChart(true)
  renderTab.value = true
  setUrlParamsFromChartStates()
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
