import { getBatteryPath } from "@/helpers/utils"
import { Icon } from "@mdi/react"
import type { JSX } from "react"

interface BatteryProps {
  level: number
  charging?: boolean
  size?: number
}

function Battery({
  level,
  charging = false,
  size = 1,
}: BatteryProps): JSX.Element | null {
  return <Icon path={getBatteryPath(level, charging)} size={size} />
}

export default Battery
