import { useSettings } from "@/hooks/useSettings"
import { mdiCompassOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useMap } from "react-map-gl/maplibre"

export default function ResetHeadingPitchButton() {
  const map = useMap()
  const { mapAnimations } = useSettings()
  return (
    <Tooltip title="Reset heading and pitch" placement="auto">
      <IconButton
        onClick={() => {
          map.current?.resetNorthPitch({ animate: mapAnimations })
        }}
      >
        <Icon path={mdiCompassOutline} size={1} />
      </IconButton>
    </Tooltip>
  )
}
