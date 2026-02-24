import { useAuth } from "@/hooks/useAuth"
import { getGeolocation } from "@/helpers/locations"
import { Severity } from "@/types/enums"
import { mdiCrosshairs, mdiCrosshairsGps, mdiCrosshairsOff } from "@mdi/js"
import Icon from "@mdi/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useMap } from "react-map-gl/maplibre"
import { useSettings } from "@/hooks/useSettings"
import { useTranslation } from "react-i18next"
import { ActionIcon, Tooltip, type FloatingPosition } from "@mantine/core"

interface CurrentLocationButtonProps {
  selected: boolean
  onClick: (value: boolean) => void
  tooltipPosition?: FloatingPosition
}

export default function CurrentLocationButton({
  selected,
  onClick,
  tooltipPosition = "left",
}: CurrentLocationButtonProps) {
  const auth = useAuth()
  const map = useMap()
  const queryClient = useQueryClient()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()

  const { data: userGeolocation = null, isError } = useQuery({
    queryKey: ["geolocation"],
    queryFn: getGeolocation,
    retry: false,
  })

  return (
    <Tooltip
      label={t("components.map_controls.go_to_current_location")}
      position={tooltipPosition}
    >
      <ActionIcon
        size="xl"
        onClick={() => {
          if (userGeolocation) {
            map.current?.flyTo({
              center: [
                userGeolocation.coords.longitude,
                userGeolocation.coords.latitude,
              ],
              zoom: 18,
              bearing: 0,
              animate: mapAnimations,
            })
            onClick(true)
          } else {
            queryClient.invalidateQueries({
              queryKey: ["geolocation"],
            })
            if (isError) {
              auth?.throwMessage(
                "components.map_controls.geolocation_error",
                Severity.ERROR,
              )
            }
          }
        }}
      >
        <Icon
          path={
            userGeolocation
              ? selected
                ? mdiCrosshairsGps
                : mdiCrosshairs
              : mdiCrosshairsOff
          }
          size={1}
        />
      </ActionIcon>
    </Tooltip>
  )
}
