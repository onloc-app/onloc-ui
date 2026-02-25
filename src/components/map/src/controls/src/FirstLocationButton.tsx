import type { Location } from "@/types/types"
import { ActionIcon, Tooltip } from "@mantine/core"
import { mdiPageFirst } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()

  return (
    <Tooltip label={t("components.map_controls.go_to.first_location")}>
      <ActionIcon
        onClick={() => {
          const location = locations[0]
          onClick(location)
        }}
        disabled={selectedLocation.id === locations[0].id}
      >
        <Icon path={mdiPageFirst} size={1} />
      </ActionIcon>
    </Tooltip>
  )
}
