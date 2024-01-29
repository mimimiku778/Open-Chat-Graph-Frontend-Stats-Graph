import { useEffect, useRef } from 'preact/hooks'
import OpenChatChart from './class/OpenChatChart'
import { preData } from './class/ChartJS/preData'

export function App() {
  const canvas = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const chart = new OpenChatChart()
    chart.init(canvas.current!, 8)
    chart.render(
      { date: preData.date, graph1: preData.leaveCount, graph2: preData.joinCount },
      { label1: 'メンバー数', label2: '急上昇の最高順位' }
    )
  }, [canvas.current])

  return (
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
  )
}
