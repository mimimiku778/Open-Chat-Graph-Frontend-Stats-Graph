import { Box, Tab, Tabs } from '@mui/material'
import { signal } from '@preact/signals'
import { MutableRef } from 'preact/hooks'
import OpenChatChart from '../class/OpenChatChart'

export const limitBtnsSignal = signal<ChartLimit>(8)

export default function ChartLimitBtns({ chart }: { chart: MutableRef<OpenChatChart | null> }) {
  const handleChange = (e: MouseEvent, limit: ChartLimit) => {
    e.preventDefault()
    limitBtnsSignal.value = limit
    chart.current?.update(limit)
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
      <Tabs onChange={handleChange} variant="fullWidth" value={limitBtnsSignal.value}>
        <Tab value={8} label="1 週間" />
        <Tab value={31} label="1 ヶ月" />
        <Tab value={0} label="全期間" />
      </Tabs>
    </Box>
  )
}
