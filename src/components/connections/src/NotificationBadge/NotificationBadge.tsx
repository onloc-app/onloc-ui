import { numberToBadgeString } from "@/helpers/utils"
import type { Connection } from "@/types/types"
import { Badge, type BadgeVariant } from "@mantine/core"
import classes from "./NotificationBadge.module.css"

interface NotificationBadgeProps {
  connections?: Connection[]
  variant?: BadgeVariant
}

export default function NotificationBadge({
  connections,
  variant = "filled",
}: NotificationBadgeProps) {
  if (connections && connections.length > 0) {
    return (
      <div className={classes["container"]}>
        <Badge variant={variant}>
          {numberToBadgeString(connections.length)}
        </Badge>
      </div>
    )
  }
}
