import { fitBounds } from "@/helpers/locations"
import { useSettings } from "@/hooks/useSettings"
import type { Location } from "@/types/types"
import { mdiFitToScreenOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useMap } from "react-map-gl/maplibre"

interface FitBoundsButtonProps {
  locations: Location[]
}

export default function FitBoundsButton({ locations }: FitBoundsButtonProps) {
  const map = useMap()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()

  return (
    <Tooltip title={t("components.map_controls.fit_bounds")} placement="auto">
      <IconButton
        onClick={() => {
          if (map.current) {
            fitBounds(map.current, locations, mapAnimations)
          }
        }}
      >
        <Icon path={mdiFitToScreenOutline} size={1} />
      </IconButton>
    </Tooltip>
  )
}
