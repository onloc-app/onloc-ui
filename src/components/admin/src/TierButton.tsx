import { stringToHexColor } from "@/helpers/utils"
import type { Tier } from "@/types/types"
import { MenuItem, Select, type SelectChangeEvent } from "@mui/material"

interface TierButtonProps {
  currentTier: Tier
  tiers: Tier[]
  onTierChange: (tier: Tier) => void
}

export default function TierButton({
  currentTier,
  tiers,
  onTierChange,
}: TierButtonProps) {
  const handleChange = (event: SelectChangeEvent<number>) => {
    const tierId = event.target.value
    const tier = tiers.find((tier) => tier.id === tierId)
    if (tier) {
      onTierChange(tier)
    }
  }

  return (
    <Select
      value={currentTier.id}
      onChange={handleChange}
      variant="standard"
      fullWidth
      size="small"
      sx={{
        "&:before": {
          borderBottomColor: stringToHexColor(currentTier.name),
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottomColor: stringToHexColor(currentTier.name),
        },
        "&:after": {
          borderBottomColor: stringToHexColor(currentTier.name),
        },
        color: stringToHexColor(currentTier.name),
        fontWeight: 500,
      }}
    >
      {tiers.map((tier) => {
        return <MenuItem value={tier.id}>{tier.name}</MenuItem>
      })}
    </Select>
  )
}
