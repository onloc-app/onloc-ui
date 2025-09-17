import { Chip, Typography } from "@mui/material"
import { Battery } from "@/components"

interface BatteryChipProps {
  level: number
}

function BatteryChip({ level }: BatteryChipProps) {
  return (
    <Chip
      sx={{ paddingLeft: 0.5 }}
      icon={<Battery level={level} size={0.8} />}
      label={
        <Typography component="span" sx={{ ml: -1 }}>
          {level}%
        </Typography>
      }
      size="small"
    />
  )
}

export default BatteryChip
