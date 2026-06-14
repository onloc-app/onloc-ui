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
  mdiBatteryChargingOutline,
  mdiBatteryCharging10,
  mdiBatteryCharging20,
  mdiBatteryCharging30,
  mdiBatteryCharging40,
  mdiBatteryCharging50,
  mdiBatteryCharging60,
  mdiBatteryCharging70,
  mdiBatteryCharging80,
  mdiBatteryCharging90,
  mdiBatteryCharging,
} from "@mdi/js"
import type { JSX } from "react"

interface BatteryProps {
  level: number
  charging?: boolean | null
  size?: number
}

function Battery({ level, charging = false, size = 1 }: BatteryProps): JSX.Element | null {
  function getBatteryPath(level: number): string {
    if (level >= 0 && level <= 10) return charging ? mdiBatteryOutline : mdiBatteryChargingOutline
    if (level > 10 && level <= 20) return charging ? mdiBatteryCharging10 : mdiBattery10
    if (level > 20 && level <= 30) return charging ? mdiBatteryCharging20 : mdiBattery20
    if (level > 30 && level <= 40) return charging ? mdiBatteryCharging30 : mdiBattery30
    if (level > 40 && level <= 50) return charging ? mdiBatteryCharging40 : mdiBattery40
    if (level > 50 && level <= 60) return charging ? mdiBatteryCharging50 : mdiBattery50
    if (level > 60 && level <= 70) return charging ? mdiBatteryCharging60 : mdiBattery60
    if (level > 70 && level <= 80) return charging ? mdiBatteryCharging70 : mdiBattery70
    if (level > 80 && level <= 90) return charging ? mdiBatteryCharging80 : mdiBattery80
    if (level > 90 && level < 100) return charging ? mdiBatteryCharging90 : mdiBattery90
    if (level === 100) return charging ? mdiBatteryCharging : mdiBattery
    return mdiBatteryOutline
  }

  return <Icon path={getBatteryPath(level)} size={size} />
}

export default Battery
