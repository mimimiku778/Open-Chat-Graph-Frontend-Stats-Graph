import { Box, Tab, Tabs } from '@mui/material'
import { signal } from '@preact/signals'
import { MutableRef } from 'preact/hooks'
import OpenChatChart from '../class/OpenChatChart'
import { fetchChart } from './ToggleButtons'

export const limitBtnsSignal = signal<ChartLimit | 25>(8)

export default function ChartLimitBtns({
  chart,
  hasPosition,
}: {
  chart: MutableRef<OpenChatChart | null>
  hasPosition: boolean
}) {
  const handleChange = (e: MouseEvent, limit: ChartLimit | 25) => {
    e.preventDefault()
    limitBtnsSignal.value = limit

    const isHour = limit === 25
    if (isHour) {
      chart.current?.setIsHour(isHour, 31)
      fetchChart(chart.current!, true)
    } else if (chart.current?.getIsHour()) {
      chart.current?.setIsHour(isHour, limit)
      fetchChart(chart.current!, true)
    } else {
      chart.current?.setIsHour(null)
      chart.current?.update(limit)
    }
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }} className="limit-btns">
      <Tabs onChange={handleChange} variant="fullWidth" value={limitBtnsSignal.value}>
        {hasPosition && <Tab value={25} label="最新24時間" />}
        <Tab value={8} label="1週間" />
        <Tab value={31} label="1ヶ月" />
        <Tab value={0} label="全期間" />
      </Tabs>
    </Box>
  )
}
