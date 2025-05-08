import Battery0BarOutlinedIcon from "@mui/icons-material/Battery0BarOutlined"
import Battery1BarOutlinedIcon from "@mui/icons-material/Battery1BarOutlined"
import Battery2BarOutlinedIcon from "@mui/icons-material/Battery2BarOutlined"
import Battery3BarOutlinedIcon from "@mui/icons-material/Battery3BarOutlined"
import Battery4BarOutlinedIcon from "@mui/icons-material/Battery4BarOutlined"
import Battery5BarOutlinedIcon from "@mui/icons-material/Battery5BarOutlined"
import Battery6BarOutlinedIcon from "@mui/icons-material/Battery6BarOutlined"
import BatteryFullOutlinedIcon from "@mui/icons-material/BatteryFullOutlined"
import { JSX } from "react"

interface BatteryProps {
  level: number
  fontSize?: number
}

function Battery({ level, fontSize = 24 }: BatteryProps): JSX.Element | null {
  const STYLE = { fontSize: fontSize }

  function getBatteryIcon(level: number): JSX.Element | null {
    if (level === 0) return <Battery0BarOutlinedIcon sx={STYLE} />
    if (level > 0 && level <= 20) return <Battery1BarOutlinedIcon sx={STYLE} />
    if (level > 20 && level <= 40) return <Battery2BarOutlinedIcon sx={STYLE} />
    if (level > 40 && level <= 50) return <Battery3BarOutlinedIcon sx={STYLE} />
    if (level > 50 && level <= 60) return <Battery4BarOutlinedIcon sx={STYLE} />
    if (level > 60 && level <= 80) return <Battery5BarOutlinedIcon sx={STYLE} />
    if (level > 80 && level < 100) return <Battery6BarOutlinedIcon sx={STYLE} />
    if (level === 100) return <BatteryFullOutlinedIcon sx={STYLE} />
    return null
  }

  return getBatteryIcon(level)
}

export default Battery
