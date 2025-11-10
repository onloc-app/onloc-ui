import { useAuth } from "@/contexts/AuthProvider"
import { getGeolocation } from "@/helpers/locations"
import { Severity } from "@/types/enums"
import { mdiCrosshairs, mdiCrosshairsGps, mdiCrosshairsOff } from "@mdi/js"
import Icon from "@mdi/react"
import { IconButton, Tooltip } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useMap } from "react-map-gl/maplibre"

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
    <Tooltip title="Go to current location" placement="auto">
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
