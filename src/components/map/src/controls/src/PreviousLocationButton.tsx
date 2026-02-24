import type { Location } from "@/types/types"
import { ActionIcon, Tooltip } from "@mantine/core"
import { mdiChevronLeft } from "@mdi/js"
import Icon from "@mdi/react"
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
    <Tooltip label={t("components.map_controls.go_to.previous_location")}>
      <ActionIcon
        onClick={() => {
          const location = locations[locations.indexOf(selectedLocation) - 1]
          onClick(location)
        }}
        disabled={selectedLocation.id === locations[0].id}
      >
        <Icon path={mdiChevronLeft} size={1} />
      </ActionIcon>
    </Tooltip>
  )
}
