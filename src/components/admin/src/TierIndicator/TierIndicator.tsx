import type { Tier } from "@/types/types"
import classes from "./TierIndicator.module.css"
import { stringToHexColor } from "@/helpers/utils"

interface TierIndicatorProps {
  tier: Tier
}

export default function TierIndicator({ tier }: TierIndicatorProps) {
  return (
    <div
      className={classes["indicator"]}
      style={{ backgroundColor: stringToHexColor(tier.name) }}
    />
  )
}
