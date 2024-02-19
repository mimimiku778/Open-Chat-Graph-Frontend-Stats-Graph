import { useEffect, useLayoutEffect, useRef } from 'preact/hooks'
import ChartLimitBtns from './components/ChartLimitBtns'
import ToggleButtons from './components/ToggleButtons'
import { signal } from '@preact/signals'
import {
  chart,
  initDisplay,
  loading,
  setChartStatesFromUrlParams,
  setUrlParamsFromChartStates,
} from './signal/chartState'
import { fetchChart, renderChartWithoutRanking } from './util/fetchRenderer'
import { Box, CircularProgress } from '@mui/material'

const renderTab = signal(false)
const renderPositionBtns = signal(false)

export const setRenderPositionBtns = (toggle: boolean) => {
  renderPositionBtns.value = toggle
  if (!toggle) document.getElementById('app')!.style.minHeight = '49px'
}

const removeDummyCanvas = () => {
  document.getElementById('dummy-canvas')!.classList.toggle('chart-canvas-box')
}

const init = async () => {
  setChartStatesFromUrlParams()

  if (initDisplay()) {
    await fetchChart(true)
  } else {
    renderChartWithoutRanking()
  }

  renderTab.value = true
  setUrlParamsFromChartStates()
}

function LoadingSpinner() {
  return (
    <Box
      className="fade-in"
      sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <CircularProgress color="inherit" />
    </Box>
  )
}

export function App() {
  const canvas = useRef<null | HTMLCanvasElement>(null)

  useLayoutEffect(removeDummyCanvas, [])

  useEffect(() => {
    chart.init(canvas.current!)
    init()
  }, [])

  return (
    <div>
      <div class="chart-canvas-box">
        {loading.value && <LoadingSpinner />}
        <canvas id="chart-preact-canvas" ref={canvas}></canvas>
      </div>
      <div style="min-height: 49px">{renderTab.value && <ChartLimitBtns />}</div>
      <div style="min-height: 68px">{renderPositionBtns.value && <ToggleButtons />}</div>
    </div>
  )
}
