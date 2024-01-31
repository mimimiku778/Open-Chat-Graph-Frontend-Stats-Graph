import { Chip, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { signal } from '@preact/signals'
import OpenChatChart from '../class/OpenChatChart'
import { MutableRef } from 'preact/hooks'
import { fetchInit, fetchUpdate } from '../util/fetchApi'

export const chipsSignal = signal<ToggleChart>('rising')
export const cateSignal = signal<'cate' | 'all'>('cate')

const chips1: [string, ToggleChart][] = [
  ['急上昇', 'rising'],
  ['ランキング', 'ranking'],
]

const fetchChart = (chart: OpenChatChart) => {
  const isAll = cateSignal.value === 'all'
  const isRising = chipsSignal.value === 'rising'

  if (!chipsSignal.value) {
    fetchInit(chart)
  } else {
    fetchUpdate(chart, `${chipsSignal.value}${isAll ? '_all' : ''}`, isRising, isAll)
  }
}

export default function ToggleButtons({ chart }: { chart: MutableRef<OpenChatChart | null> }) {
  const handleChip = (alignment: ToggleChart) => () => {
    chipsSignal.value = alignment
    if (!chart.current) return
    fetchChart(chart.current)
  }

  const handleAlignment = (e: MouseEvent, alignment: 'cate' | 'all' | null) => {
    e.preventDefault()
    if (!alignment) return
    cateSignal.value = alignment
    if (!chart.current) return
    fetchChart(chart.current)
  }

  const sig = chipsSignal.value
  return (
    <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" m="1.5rem 0">
      <Stack direction="row" spacing={1} alignItems="center">
        <ToggleButtonGroup color="primary" value={cateSignal.value} exclusive onChange={handleAlignment} size="small">
          <ToggleButton value="cate">
            <Typography variant="caption">カテゴリー内</Typography>
          </ToggleButton>
          <ToggleButton value="all">
            <Typography variant="caption">すべて</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        {chips1.map((chip) => (
          <Chip
            label={chip[0]}
            variant={sig === chip[1] ? undefined : 'outlined'}
            onClick={handleChip(sig === chip[1] ? '' : chip[1])}
            color="primary"
          />
        ))}
      </Stack>
    </Stack>
  )
}
