import { useSettings } from "@/hooks/useSettings"
import { ActionIcon, Tooltip, type FloatingPosition } from "@mantine/core"
import { mdiCompassOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"
import { useMap } from "react-map-gl/maplibre"

interface ResetHeadingPitchButtonProps {
  tooltipPosition?: FloatingPosition
}

export default function ResetHeadingPitchButton({
  tooltipPosition = "right",
}: ResetHeadingPitchButtonProps) {
  const map = useMap()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()

  return (
    <Tooltip
      label={t("components.map_controls.reset_heading_pitch")}
      position={tooltipPosition}
    >
      <ActionIcon
        onClick={() => {
          map.current?.resetNorthPitch({ animate: mapAnimations })
        }}
      >
        <Icon path={mdiCompassOutline} size={1} />
      </ActionIcon>
    </Tooltip>
  )
}
