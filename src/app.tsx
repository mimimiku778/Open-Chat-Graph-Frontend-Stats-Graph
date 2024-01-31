import { useEffect, useRef, useState } from 'preact/hooks'
import OpenChatChart from './class/OpenChatChart'
import { fetchFirst } from './util/fetchApi'
import ChartLimitBtns from './components/ChartLimitBtns'
import ToggleButtons from './components/ToggleButtons'

export function App() {
  const canvas = useRef<HTMLCanvasElement>(document.getElementById('chart-preact-canvas') as HTMLCanvasElement)
  const chart = useRef<OpenChatChart>(new OpenChatChart(canvas.current))
  const [hasPosition, setHasPosition] = useState(true)

  useEffect(() => {
    fetchFirst(chart.current, 'ranking', false, setHasPosition)
  }, [])

  return (
    <div>
      <ChartLimitBtns chart={chart} />
      {hasPosition && <ToggleButtons chart={chart} />}
    </div>
  )
}
