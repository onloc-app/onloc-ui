import { useSettings } from "@/hooks/useSettings"
import { ActionIcon, Tooltip, type FloatingPosition } from "@mantine/core"
import { mdiMinus } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"
import { useMap } from "react-map-gl/maplibre"

interface ZoomOutButtonProps {
  tooltipPosition?: FloatingPosition
}

export default function ZoomOutButton({
  tooltipPosition = "right",
}: ZoomOutButtonProps) {
  const map = useMap()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()

  return (
    <Tooltip
      label={t("components.map_controls.zoom_out")}
      position={tooltipPosition}
    >
      <ActionIcon
        onClick={() => {
          map.current?.zoomOut({ animate: mapAnimations })
        }}
      >
        <Icon path={mdiMinus} size={1} />
      </ActionIcon>
    </Tooltip>
  )
}
