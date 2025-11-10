import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useMap } from "react-map-gl/maplibre"

export default function ZoomInButton() {
  const map = useMap()
  return (
    <Tooltip title="Zoom in" placement="auto">
      <IconButton
        onClick={() => {
          map.current?.zoomIn()
        }}
      >
        <Icon path={mdiPlus} size={1} />
      </IconButton>
    </Tooltip>
  )
}
