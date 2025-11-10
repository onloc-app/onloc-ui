import { mdiMinus } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useMap } from "react-map-gl/maplibre"

export default function ZoomOutButton() {
  const map = useMap()
  return (
    <Tooltip title="Zoom out" placement="auto">
      <IconButton
        onClick={() => {
          map.current?.zoomOut()
        }}
      >
        <Icon path={mdiMinus} size={1} />
      </IconButton>
    </Tooltip>
  )
}
