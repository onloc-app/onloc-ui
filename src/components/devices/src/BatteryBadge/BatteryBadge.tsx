import { InformationBadge } from "@/components"
import { getBatteryPath } from "@/helpers/utils"

interface BatteryBadgeProps {
  level: number
  charging?: boolean | null
}

function BatteryBadge({ level, charging = false }: BatteryBadgeProps) {
  return (
    <InformationBadge
      label={`${level}%`}
      icon={getBatteryPath(level, charging)}
    />
  )
}

export default BatteryBadge
