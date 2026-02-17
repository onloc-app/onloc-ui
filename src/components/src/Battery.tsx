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
  function getBatteryPath(level: number): string {
    if (level >= 0 && level <= 10) return mdiBatteryOutline
    if (level > 10 && level <= 20) return mdiBattery10
    if (level > 20 && level <= 30) return mdiBattery20
    if (level > 30 && level <= 40) return mdiBattery30
    if (level > 40 && level <= 50) return mdiBattery40
    if (level > 50 && level <= 60) return mdiBattery50
    if (level > 60 && level <= 70) return mdiBattery60
    if (level > 70 && level <= 80) return mdiBattery70
    if (level > 80 && level <= 90) return mdiBattery80
    if (level > 90 && level < 100) return mdiBattery90
    if (level === 100) return mdiBattery
    return mdiBatteryOutline
  }

  return <Icon path={getBatteryPath(level)} size={size} />
}

export default Battery
