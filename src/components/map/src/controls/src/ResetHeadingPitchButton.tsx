import { useSettings } from "@/hooks/useSettings"
import { mdiCompassOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useMap } from "react-map-gl/maplibre"

export default function ResetHeadingPitchButton() {
  const map = useMap()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()

  return (
    <Tooltip
      title={t("components.map_controls.reset_heading_pitch")}
      placement="auto"
    >
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
