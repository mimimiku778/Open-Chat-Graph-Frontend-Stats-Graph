import { useEffect, useRef, useState } from 'preact/hooks'
import { Box } from '@mui/material'
import OpenChatChart from './class/OpenChatChart'
import { render } from 'preact'
import { preData } from './class/ChartJS/preData'

export function App() {
  const canvas = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const chart = new OpenChatChart()
    chart.init(canvas.current!, 8)
    chart.render(
      { date: preData.date, graph1: preData.joinCount, graph2: preData.leaveCount },
      { label1: 'test', label2: 'test' }
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
