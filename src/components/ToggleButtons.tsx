import { Box, Chip, Stack, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material'
import {
  categorySignal,
  rankingRisingSignal,
  handleChangeCategory,
  handleChangeRankingRising,
  toggleShowCategorySignal,
} from '../signal/chartState'
import SettingButton from './SettingButton'

const chips1: [string, ToggleChart][] = [
  ['急上昇', 'rising'],
  ['ランキング', 'ranking'],
]

function CategoryToggle() {
  const handleChangeToggle = (e: MouseEvent, alignment: urlParamsValue<'category'> | null) => {
    e.preventDefault()
    rankingRisingSignal.value !== 'none' && handleChangeCategory(alignment)
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ opacity: rankingRisingSignal.value === 'none' ? 0.2 : undefined }}
    >
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
  )
}

export default function ToggleButtons() {
  const isMiniMobile = useMediaQuery('(max-width:359px)')
  const isPc = useMediaQuery('(min-width:512px)')

  const sig = rankingRisingSignal.value
  return (
    <Box>
      <Stack
        minHeight="48px"
        direction="row"
        alignItems="center"
        justifyContent={isPc ? 'space-around' : 'space-between'}
      >
        <Typography variant="h4" fontSize="13px" fontWeight="bold" color="#111">
          ランキング・急上昇の順位表示
        </Typography>
        <SettingButton />
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="center"
        m={isMiniMobile ? '0 -1rem' : '0'}
        gap={isMiniMobile ? '2px' : '1rem'}
      >
        <CategoryToggle />
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
    </Box>
  )
}
