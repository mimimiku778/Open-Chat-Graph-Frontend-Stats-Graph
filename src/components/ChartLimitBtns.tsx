import { Box, Tab, Tabs } from '@mui/material'
import { signal } from '@preact/signals'
import { handleChangeLimit, limitBtnsSignal } from '../app'

const toggle24hSignal = signal(true)
const toggleMonthSignal = signal(true)
const toggleAllSignal = signal(true)

export function toggleDisplay24h(toggle: boolean) {
  toggle24hSignal.value = toggle
}

export function toggleDisplayMonth(toggle: boolean) {
  toggleMonthSignal.value = toggle
}

export function toggleDisplayAll(toggle: boolean) {
  toggleAllSignal.value = toggle
}

export default function ChartLimitBtns() {
  const handleChange = (e: MouseEvent, limit: ChartLimit | 25) => {
    e.preventDefault()
    handleChangeLimit(limit)
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: '#efefef', width: '100%' }} className="limit-btns category-tab">
      <Tabs onChange={handleChange} variant="fullWidth" value={limitBtnsSignal.value}>
        {toggle24hSignal.value && <Tab value={25} label="最新24時間" />}
        <Tab value={8} label="1週間" />
        {toggleMonthSignal.value && <Tab value={31} label="1ヶ月" />}
        {toggleAllSignal.value && <Tab value={0} label="全期間" />}
      </Tabs>
    </Box>
  )
}
