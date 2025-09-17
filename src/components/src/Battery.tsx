import Icon from "@mdi/react"
import {
  mdiBatteryOutline,
  mdiBattery10,
  mdiBattery20,
  mdiBattery30,
  mdiBattery40,
  mdiBattery50,
  mdiBattery60,
  mdiBattery70,
  mdiBattery80,
  mdiBattery90,
  mdiBattery,
} from "@mdi/js"
import type { JSX } from "react"

interface BatteryProps {
  level: number
  size?: number
}

function Battery({ level, size = 1 }: BatteryProps): JSX.Element | null {
  function getBatteryIcon(level: number): JSX.Element | null {
    if (level >= 0 && level <= 10)
      return <Icon path={mdiBatteryOutline} size={size} />
    if (level > 10 && level <= 20)
      return <Icon path={mdiBattery10} size={size} />
    if (level > 20 && level <= 30)
      return <Icon path={mdiBattery20} size={size} />
    if (level > 30 && level <= 40)
      return <Icon path={mdiBattery30} size={size} />
    if (level > 40 && level <= 50)
      return <Icon path={mdiBattery40} size={size} />
    if (level > 50 && level <= 60)
      return <Icon path={mdiBattery50} size={size} />
    if (level > 60 && level <= 70)
      return <Icon path={mdiBattery60} size={size} />
    if (level > 70 && level <= 80)
      return <Icon path={mdiBattery70} size={size} />
    if (level > 80 && level <= 90)
      return <Icon path={mdiBattery80} size={size} />
    if (level > 90 && level < 100)
      return <Icon path={mdiBattery90} size={size} />
    if (level === 100) return <Icon path={mdiBattery} size={size} />
    return null
  }

  return getBatteryIcon(level)
}

export default Battery
