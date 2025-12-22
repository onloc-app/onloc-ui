import { useSettings } from "@/hooks/useSettings"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useMap } from "react-map-gl/maplibre"

export default function ZoomInButton() {
  const map = useMap()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()

  return (
    <Tooltip title={t("components.map_controls.zoom_in")} placement="auto">
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
