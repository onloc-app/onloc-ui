import type { Location } from "@/types/types"
import { ActionIcon, Tooltip } from "@mantine/core"
import { mdiPageLast } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()

  return (
    <Tooltip label={t("components.map_controls.go_to.last_location")}>
      <ActionIcon
        onClick={() => {
          const location = locations[locations.length - 1]
          onClick(location)
        }}
        disabled={selectedLocation.id === locations[locations.length - 1].id}
      >
        <Icon path={mdiPageLast} size={1} />
      </ActionIcon>
    </Tooltip>
  )
}
