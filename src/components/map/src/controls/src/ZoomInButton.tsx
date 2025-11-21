import { useSettings } from "@/hooks/useSettings"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useMap } from "react-map-gl/maplibre"

export default function ZoomInButton() {
  const map = useMap()
  const { mapAnimations } = useSettings()
  return (
    <Tooltip title="Zoom in" placement="auto">
      <IconButton
        onClick={() => {
          map.current?.zoomIn({ animate: mapAnimations })
        }}
      >
        <Icon path={mdiPlus} size={1} />
      </IconButton>
    </Tooltip>
  )
}
