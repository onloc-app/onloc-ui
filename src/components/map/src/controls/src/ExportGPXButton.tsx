import { exportToGPX } from "@/helpers/locations"
import type { Location } from "@/types/types"
import { mdiExport } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"

interface ExportGPXButtonProps {
  locations: Location[]
  name: string
}

export default function ExportGPXButton({
  locations,
  name,
}: ExportGPXButtonProps) {
  return (
    <Tooltip title="Export to gpx" placement="auto">
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
