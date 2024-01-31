import { useEffect, useRef } from 'preact/hooks'
import OpenChatChart from './class/OpenChatChart'
import { fetchUpdate } from './util/fetchApi'
import ChartLimitBtns from './components/ChartLimitBtns'
import ToggleButtons from './components/ToggleButtons'

export function App() {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const chart = useRef<OpenChatChart | null>(null)

  useEffect(() => {
    chart.current = new OpenChatChart(canvas.current!)
    fetchUpdate(chart.current, 'rising', true, false)
  }, [])

  return (
    <div style="width: 100%">
      <div
        style="
        width: 100%;
        margin: 0 auto;
        padding: 0;
        aspect-ratio: 1.8 / 1;
        user-select: none;
        -webkit-user-select: none;
        "
      >
        <canvas ref={canvas}></canvas>
      </div>
      <ChartLimitBtns chart={chart} />
      <ToggleButtons chart={chart} />
    </div>
  )
}
