import type { Location } from "@/types/types"
import { mdiChevronRight } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"

interface NextLocationButtonProps {
  locations: Location[]
  selectedLocation: Location
  onClick: (location: Location) => void
}

export default function NextLocationButton({
  locations,
  selectedLocation,
  onClick,
}: NextLocationButtonProps) {
  return (
    <Tooltip title="Go to next location">
      <IconButton
        onClick={() => {
          const location = locations[locations.indexOf(selectedLocation) + 1]
          onClick(location)
        }}
        disabled={selectedLocation.id === locations[locations.length - 1].id}
      >
        <Icon path={mdiChevronRight} size={1} />
      </IconButton>
    </Tooltip>
  )
}
