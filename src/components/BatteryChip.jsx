import { Chip, Typography } from "@mui/material";
import Battery from "./Battery";

function BatteryChip({ level }) {
  return (
    <Chip
      icon={<Battery level={level} />}
      label={
        <Typography component="span">
          {level}%
        </Typography>
      }
      size="small"
    />
  );
}

export default BatteryChip;
