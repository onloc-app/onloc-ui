import { exportToGPX } from "@/helpers/locations"
import type { Location } from "@/types/types"
import { ActionIcon, Tooltip, type FloatingPosition } from "@mantine/core"
import { mdiExport } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"

interface ExportGPXButtonProps {
  locations: Location[]
  name: string
  tooltipPosition?: FloatingPosition
}

export default function ExportGPXButton({
  locations,
  name,
  tooltipPosition = "left",
}: ExportGPXButtonProps) {
  const { t } = useTranslation()

  return (
    <Tooltip
      label={t("components.map_controls.export_to_gpx")}
      position={tooltipPosition}
    >
      <ActionIcon
        onClick={() =>
          exportToGPX(
            locations,
            `${name}-${locations[0].id}-${locations[locations.length - 1].id}`,
          )
        }
      >
        <Icon path={mdiExport} size={1} />
      </ActionIcon>
    </Tooltip>
  )
}
