import { mdiGlobeModel } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next"

interface MapProjectionButtonProps {
  projection: "globe" | "mercator"
  onClick: (projection: "globe" | "mercator") => void
}

export default function MapProjectionButton({
  projection,
  onClick,
}: MapProjectionButtonProps) {
  const { t } = useTranslation()

  return (
    <Tooltip
      title={t("components.map_controls.change_map_projection")}
      placement="auto"
    >
      <IconButton
        onClick={() => {
          if (projection === "globe") {
            onClick("mercator")
          } else {
            onClick("globe")
          }
        }}
      >
        <Icon path={mdiGlobeModel} size={1} />
      </IconButton>
    </Tooltip>
  )
}
