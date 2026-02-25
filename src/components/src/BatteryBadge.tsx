import { Battery } from "@/components"
import { Badge, Flex, Typography } from "@mantine/core"

interface BatteryBadgeProps {
  level: number
}

function BatteryBadge({ level }: BatteryBadgeProps) {
  return (
    <Badge
      size="lg"
      variant="light"
      color="dark"
      leftSection={
        <Flex>
          <Battery level={level} size={0.8} />
        </Flex>
      }
    >
      <Typography sx={{ ml: -1 }}>{level}%</Typography>
    </Badge>
  )
}

export default BatteryBadge
