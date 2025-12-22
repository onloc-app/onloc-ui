import { useAuth } from "@/hooks/useAuth"
import { getGeolocation } from "@/helpers/locations"
import { Severity } from "@/types/enums"
import { mdiCrosshairs, mdiCrosshairsGps, mdiCrosshairsOff } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useMap } from "react-map-gl/maplibre"
import { useSettings } from "@/hooks/useSettings"
import { useTranslation } from "react-i18next"

interface CurrentLocationButtonProps {
  selected: boolean
  onClick: (value: boolean) => void
}

export default function CurrentLocationButton({
  selected,
  onClick,
}: CurrentLocationButtonProps) {
  const auth = useAuth()
  const map = useMap()
  const queryClient = useQueryClient()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()

  const {
    data: userGeolocation = null,
    error: userGeolocationError,
    isError: isUserGeolocationError,
  } = useQuery({
    queryKey: ["geolocation"],
    queryFn: getGeolocation,
    retry: false,
  })

  return (
    <Tooltip
      title={t("components.map_controls.go_to_current_location")}
      placement="auto"
    >
      <IconButton
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
            if (isUserGeolocationError) {
              auth?.throwMessage(userGeolocationError.message, Severity.ERROR)
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
      </IconButton>
    </Tooltip>
  )
}
