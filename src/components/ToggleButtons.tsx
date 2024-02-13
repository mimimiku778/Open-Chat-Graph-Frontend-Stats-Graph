import { Chip, Stack, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material'
import { categorySignal, rankingRisingSignal, handleChangeCategory, handleChangeRankingRising, toggleShowCategorySignal } from '../signal/chartState'

const chips1: [string, ToggleChart][] = [
  ['急上昇', 'rising'],
  ['ランキング', 'ranking'],
]

export default function ToggleButtons() {
  const isMiniMobile = useMediaQuery('(max-width:359px)')

  const handleChangeToggle = (e: MouseEvent, alignment: urlParamsValue<'category'> | null) => {
    e.preventDefault()
    handleChangeCategory(alignment)
  }

  const sig = rankingRisingSignal.value
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
        <ToggleButtonGroup value={categorySignal.value} exclusive onChange={handleChangeToggle} size="small">
          <ToggleButton value="all">
            <Typography variant="caption">すべて</Typography>
          </ToggleButton>
          {toggleShowCategorySignal.value && (
            <ToggleButton value="in">
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
                onClick={() => handleChangeRankingRising(sig === chip[1] ? 'none' : chip[1])}
                size={isMiniMobile ? 'small' : 'medium'}
              />
            )
        )}
      </Stack>
    </Stack>
  )
}
