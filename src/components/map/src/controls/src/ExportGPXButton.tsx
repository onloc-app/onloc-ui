import { exportToGPX } from "@/helpers/locations"
import type { Location } from "@/types/types"
import { mdiExport } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next"

interface ExportGPXButtonProps {
  locations: Location[]
  name: string
}

export default function ExportGPXButton({
  locations,
  name,
}: ExportGPXButtonProps) {
  const { t } = useTranslation()

  return (
    <Tooltip title={t("components.map_controls.export_to_gpx")} placement="top">
      <IconButton
        onClick={() =>
          exportToGPX(
            locations,
            `${name}-${locations[0].id}-${locations[locations.length - 1].id}`,
          )
        }
      >
        <Icon path={mdiExport} size={1} />
      </IconButton>
    </Tooltip>
  )
}
