import type { Location } from "@/types/types"
import { mdiPageFirst } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"

interface FirstLocationButtonProps {
  locations: Location[]
  selectedLocation: Location
  onClick: (location: Location) => void
}

export default function FirstLocationButton({
  locations,
  selectedLocation,
  onClick,
}: FirstLocationButtonProps) {
  return (
    <Tooltip title="Go to the first location">
      <IconButton
        onClick={() => {
          const location = locations[0]
          onClick(location)
        }}
        disabled={selectedLocation.id === locations[0].id}
      >
        <Icon path={mdiPageFirst} size={1} />
      </IconButton>
    </Tooltip>
  )
}
