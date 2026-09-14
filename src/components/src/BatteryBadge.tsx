import { Battery } from "@/components"
import { Badge, Flex, Text, useComputedColorScheme } from "@mantine/core"

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
        <Flex>
          <Battery level={level} charging={charging} size={0.8} />
        </Flex>
      }
    >
      <Text fw={500}>{level}%</Text>
    </Badge>
  )
}

export default BatteryBadge
