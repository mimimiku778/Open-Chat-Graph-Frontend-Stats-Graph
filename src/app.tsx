import { useEffect, useRef } from 'preact/hooks'
import OpenChatChart from './class/OpenChatChart'
import { fetchUpdate } from './util/fetchApi'
import ChartLimitBtns from './components/ChartLimitBtns'
import ToggleButtons from './components/ToggleButtons'

export function App() {
  const canvas = useRef<HTMLCanvasElement>(document.getElementById('chart-preact-canvas') as HTMLCanvasElement)
  const chart = useRef<OpenChatChart>(new OpenChatChart(canvas.current))

  useEffect(() => {
    fetchUpdate(chart.current, 'ranking', false, false)
  }, [])

  return (
    <div>
      <ChartLimitBtns chart={chart} />
      <ToggleButtons chart={chart} />
    </div>
  )
}
