import { stringToHexColor } from "@/helpers/utils"
import type { Tier } from "@/types/types"
import { Button } from "@mui/material"

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
  return (
    <Button
      sx={{
        color: "white",
        backgroundColor: stringToHexColor(currentTier.name),
      }}
      onClick={() => {
        let nextIndex =
          tiers.findIndex((tier) => tier.id === currentTier.id) + 1
        if (!tiers[nextIndex]) {
          nextIndex = 0
        }
        onTierChange(tiers[nextIndex])
      }}
    >
      {currentTier.name}
    </Button>
  )
}
