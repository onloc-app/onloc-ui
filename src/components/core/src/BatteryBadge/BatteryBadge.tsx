import { Battery } from "@/components"
import { Badge, Text, useComputedColorScheme } from "@mantine/core"
import classes from "./BatteryBadge.module.css"

interface BatteryBadgeProps {
  level: number
  charging?: boolean | null
}

function BatteryBadge({ level, charging = false }: BatteryBadgeProps) {
  const colorScheme = useComputedColorScheme("light")

  return (
    <Badge
      size="lg"
      variant="light"
      color={colorScheme === "dark" ? "dark.5" : "gray.3"}
      leftSection={
        <div className={classes["badge__icon"]}>
          <Battery level={level} charging={charging} size={0.8} />
        </div>
      }
    >
      <Text className={classes["badge__text"]}>{level}%</Text>
    </Badge>
  )
}

export default BatteryBadge
