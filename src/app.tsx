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
const positionBtnsHeight = signal(68)

export const setRenderPositionBtns = (toggle: boolean) => {
  renderPositionBtns.value = toggle
  positionBtnsHeight.value = toggle ? 68 : 0
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
    <Box className="fade-in" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
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
        <canvas
          id="chart-preact-canvas"
          ref={canvas}
          aria-label="メンバー数・ランキキング履歴の統計グラフ"
          role="img"
        ></canvas>
      </div>
      <div style="min-height: 49px">{renderTab.value && <ChartLimitBtns />}</div>
      <div style={`min-height: ${positionBtnsHeight.value}px`}>{renderPositionBtns.value && <ToggleButtons />}</div>
    </div>
  )
}
