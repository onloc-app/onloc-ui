import { useSettings } from "@/hooks/useSettings"
import { mdiMinus } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useMap } from "react-map-gl/maplibre"

export default function ZoomOutButton() {
  const map = useMap()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()

  return (
    <Tooltip title={t("components.map_controls.zoom_out")} placement="auto">
      <IconButton
        onClick={() => {
          map.current?.zoomOut({ animate: mapAnimations })
        }}
      >
        <Icon path={mdiMinus} size={1} />
      </IconButton>
    </Tooltip>
  )
}
