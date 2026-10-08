import { Badge, Text, useComputedColorScheme } from "@mantine/core"
import { Icon } from "@mdi/react"
import classes from "./InformationBadge.module.css"

interface InformationBadgeProps {
  label: string
  icon: string
}

export default function InformationBadge({
  label,
  icon,
}: InformationBadgeProps) {
  const colorScheme = useComputedColorScheme("light")

  return (
    <Badge
      className={classes["badge"]}
      size="lg"
      variant="light"
      color={colorScheme === "dark" ? "dark.5" : "gray.3"}
      leftSection={
        <div className={classes["badge__icon"]}>
          <Icon path={icon} size={0.8} />
        </div>
      }
    >
      <Text className={classes["badge__text"]}>{label}</Text>
    </Badge>
  )
}
