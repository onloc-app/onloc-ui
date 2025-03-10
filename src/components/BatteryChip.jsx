import { Chip, Typography } from "@mui/material";
import Battery from "./Battery";

function BatteryChip({ level }) {
  return (
    <Chip
      sx={{ paddingLeft: 0.5 }}
      icon={<Battery level={level} fontSize={20} />}
      label={<Typography component="span">{level}%</Typography>}
      size="small"
    />
  );
}

export default BatteryChip;
