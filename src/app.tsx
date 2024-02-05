import { useEffect, useRef } from 'preact/hooks'
import OpenChatChart from './class/OpenChatChart'
import { fetchFirst } from './util/fetchApi'
import ChartLimitBtns from './components/ChartLimitBtns'
import ToggleButtons from './components/ToggleButtons'
import { signal } from '@preact/signals'

export const hasPosition = signal(true)

export const setHasPotision = (toggle: boolean) => {
  hasPosition.value = toggle
  if (!toggle) document.getElementById('app')!.style.height = '49px'
}

export function App() {
  const canvas = useRef<HTMLCanvasElement>(document.getElementById('chart-preact-canvas') as HTMLCanvasElement)
  const chart = useRef<OpenChatChart>(new OpenChatChart(canvas.current))

  useEffect(() => {
    fetchFirst(chart.current, 'ranking', false)
  }, [])

  return (
    <div>
      <ChartLimitBtns chart={chart} />
      {hasPosition.value && <ToggleButtons chart={chart} />}
    </div>
  )
}
