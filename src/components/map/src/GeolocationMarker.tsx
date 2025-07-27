import { Box } from "@mui/material"
import "../../../leaflet.css"
import "../../../Map.css"
import { Circle, Marker, useMap } from "react-leaflet"
import { divIcon } from "leaflet"

interface GeolocationMarkerProps {
  geolocation: GeolocationCoordinates
  onClick?: () => void
}

export default function GeolocationMarker({
  geolocation,
  onClick,
}: GeolocationMarkerProps) {
  const color = "#9768FF"
  const icon = divIcon({
    html: `<div class="map-pin" style="background-color: ${color};"></div>`,
    className: "map-device-div-icon geolocation-icon",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
  const map = useMap()

  return (
    <Box>
      <Marker
        icon={icon}
        position={[geolocation.latitude, geolocation.longitude]}
        eventHandlers={{
          click: () => {
            map.setView([geolocation.latitude, geolocation.longitude])
            if (onClick) onClick()
          },
        }}
      />
      {geolocation.accuracy ? (
        <Circle
          center={[geolocation.latitude, geolocation.longitude]}
          pathOptions={{
            fillColor: color,
            color: color,
          }}
          radius={geolocation.accuracy}
        />
      ) : null}
    </Box>
  )
}
