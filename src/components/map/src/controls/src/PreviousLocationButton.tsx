import type { Location } from "@/types/types"
import { mdiChevronLeft } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"

interface PreviousLocationButtonProps {
  locations: Location[]
  selectedLocation: Location
  onClick: (location: Location) => void
}

export default function PreviousLocationButton({
  locations,
  selectedLocation,
  onClick,
}: PreviousLocationButtonProps) {
  return (
    <Tooltip title="Go to previous location">
      <IconButton
        onClick={() => {
          const location = locations[locations.indexOf(selectedLocation) - 1]
          onClick(location)
        }}
        disabled={selectedLocation.id === locations[0].id}
      >
        <Icon path={mdiChevronLeft} size={1} />
      </IconButton>
    </Tooltip>
  )
}
