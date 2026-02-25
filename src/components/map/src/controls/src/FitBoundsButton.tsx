import { fitBounds } from "@/helpers/locations"
import { useSettings } from "@/hooks/useSettings"
import type { Location } from "@/types/types"
import { ActionIcon, Tooltip, type FloatingPosition } from "@mantine/core"
import { mdiFitToScreenOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"
import { useMap } from "react-map-gl/maplibre"

interface FitBoundsButtonProps {
  locations: Location[]
  tooltipPosition?: FloatingPosition
}

export default function FitBoundsButton({
  locations,
  tooltipPosition = "right",
}: FitBoundsButtonProps) {
  const map = useMap()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()

  return (
    <Tooltip
      label={t("components.map_controls.fit_bounds")}
      position={tooltipPosition}
    >
      <ActionIcon
        onClick={() => {
          if (map.current) {
            fitBounds(map.current, locations, mapAnimations)
          }
        }}
      >
        <Icon path={mdiFitToScreenOutline} size={1} />
      </ActionIcon>
    </Tooltip>
  )
}
