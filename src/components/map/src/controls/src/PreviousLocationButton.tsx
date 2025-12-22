import type { Location } from "@/types/types"
import { mdiChevronLeft } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()

  return (
    <Tooltip title={t("components.map_controls.go_to.previous_location")}>
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
