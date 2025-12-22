import type { Location } from "@/types/types"
import { mdiChevronRight } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()

  return (
    <Tooltip title={t("components.map_controls.go_to.next_location")}>
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
