import { Chip, Stack, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material'
import { signal } from '@preact/signals'
import { cateSignal, chipsSignal, handleChangeCategory, handleChangeRankingRising } from '../app'

const chips1: [string, ToggleChart][] = [
  ['急上昇', 'rising'],
  ['ランキング', 'ranking'],
]

const toggleShowCategorySignal = signal(true)

export function toggleDisplayCategory(toggle: boolean) {
  toggleShowCategorySignal.value = toggle
  cateSignal.value = toggle ? 'cate' : 'all'
  chipsSignal.value = toggle ? 'ranking' : 'rising'
}

export default function ToggleButtons() {
  const isMiniMobile = useMediaQuery('(max-width:359px)')

  const handleChangeToggle = (e: MouseEvent, alignment: 'cate' | 'all' | null) => {
    e.preventDefault()
    handleChangeCategory(alignment)
  }

  const sig = chipsSignal.value
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="center"
      m={isMiniMobile ? '0 -1rem' : '0'}
      gap={isMiniMobile ? '2px' : '1rem'}
      sx={{ pt: '2rem' }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <ToggleButtonGroup value={cateSignal.value} exclusive onChange={handleChangeToggle} size="small">
          <ToggleButton value="all">
            <Typography variant="caption">すべて</Typography>
          </ToggleButton>
          {toggleShowCategorySignal.value && (
            <ToggleButton value="cate">
              <Typography variant="caption">カテゴリー内</Typography>
            </ToggleButton>
          )}
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        {chips1.map(
          (chip) =>
            !(chip[1] === 'ranking' && !toggleShowCategorySignal.value) && (
              <Chip
                className={`openchat-item-header-chip graph ${sig === chip[1] ? 'selected' : ''}`}
                label={chip[0]}
                onClick={handleChangeRankingRising(sig === chip[1] ? 'none' : chip[1])}
                size={isMiniMobile ? 'small' : 'medium'}
              />
            )
        )}
      </Stack>
    </Stack>
  )
}
