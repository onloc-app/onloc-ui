import { useSettings } from "@/hooks/useSettings"
import { ActionIcon, Tooltip, type FloatingPosition } from "@mantine/core"
import { mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"
import { useMap } from "react-map-gl/maplibre"

interface ZoomInButtonProps {
  tooltipPosition?: FloatingPosition
}

export default function ZoomInButton({
  tooltipPosition = "right",
}: ZoomInButtonProps) {
  const map = useMap()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()

  return (
    <Tooltip
      label={t("components.map_controls.zoom_in")}
      position={tooltipPosition}
    >
      <ActionIcon
        onClick={() => {
          map.current?.zoomIn({ animate: mapAnimations })
        }}
      >
        <Icon path={mdiPlus} size={1} />
      </ActionIcon>
    </Tooltip>
  )
}
