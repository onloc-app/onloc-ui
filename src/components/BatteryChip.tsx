import { Chip, Typography } from "@mui/material";
import Battery from "./Battery";

interface BatteryChipProps {
  level: number;
}

function BatteryChip({ level }: BatteryChipProps) {
  return (
    <Chip
      sx={{ paddingLeft: 0.5 }}
      icon={<Battery level={level} fontSize={20} />}
      label={<Typography component="span" sx={{ ml: -1 }}>{level}%</Typography>}
      size="small"
    />
  );
}

export default BatteryChip;
