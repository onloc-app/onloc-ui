import { mdiGlobeModel } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"

interface MapProjectionButtonProps {
  projection: "globe" | "mercator"
  onClick: (projection: "globe" | "mercator") => void
}

export default function MapProjectionButton({
  projection,
  onClick,
}: MapProjectionButtonProps) {
  return (
    <Tooltip title="Change the map's projection" placement="auto">
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
