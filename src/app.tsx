import { useEffect, useRef } from 'preact/hooks'
import OpenChatChart from './classes/OpenChatChart'
import { fetchFirst } from './util/fetchRenderer'
import ChartLimitBtns from './components/ChartLimitBtns'
import ToggleButtons from './components/ToggleButtons'
import { signal } from '@preact/signals'

export const renderTab = signal(false)
export const hasPosition = signal(false)

export const setHasPotision = (toggle: boolean) => {
  hasPosition.value = toggle
  if (!toggle) document.getElementById('app')!.style.height = '49px'
}

export const setRenderTab = () => {
  renderTab.value = true
}

export function App() {
  const canvas = useRef<HTMLCanvasElement>(document.getElementById('chart-preact-canvas') as HTMLCanvasElement)
  const chart = useRef<OpenChatChart>(new OpenChatChart(canvas.current))

  useEffect(() => {
    fetchFirst(chart.current, 'ranking', false)
  }, [])

  return (
    <div>
      <div style="min-height: 49px">{renderTab.value && <ChartLimitBtns chart={chart} />}</div>
      <div style="min-height: 68px">{hasPosition.value && <ToggleButtons chart={chart} />}</div>
    </div>
  )
}
