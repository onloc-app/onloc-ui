import type { Location } from "@/types/types"
import { mdiPageLast } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"

interface LastLocationButtonProps {
  locations: Location[]
  selectedLocation: Location
  onClick: (location: Location) => void
}

export default function LastLocationButton({
  locations,
  selectedLocation,
  onClick,
}: LastLocationButtonProps) {
  return (
    <Tooltip title="Go to the last location">
      <IconButton
        onClick={() => {
          const location = locations[locations.length - 1]
          onClick(location)
        }}
        disabled={selectedLocation.id === locations[locations.length - 1].id}
      >
        <Icon path={mdiPageLast} size={1} />
      </IconButton>
    </Tooltip>
  )
}
