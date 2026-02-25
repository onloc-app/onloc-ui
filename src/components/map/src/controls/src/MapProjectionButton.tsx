import { ActionIcon, Tooltip, type FloatingPosition } from "@mantine/core"
import { mdiGlobeModel } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"

interface MapProjectionButtonProps {
  projection: "globe" | "mercator"
  onClick: (projection: "globe" | "mercator") => void
  tooltipPosition?: FloatingPosition
}

export default function MapProjectionButton({
  projection,
  onClick,
  tooltipPosition = "right",
}: MapProjectionButtonProps) {
  const { t } = useTranslation()

  return (
    <Tooltip
      label={t("components.map_controls.change_map_projection")}
      position={tooltipPosition}
    >
      <ActionIcon
        onClick={() => {
          if (projection === "globe") {
            onClick("mercator")
          } else {
            onClick("globe")
          }
        }}
      >
        <Icon path={mdiGlobeModel} size={1} />
      </ActionIcon>
    </Tooltip>
  )
}
