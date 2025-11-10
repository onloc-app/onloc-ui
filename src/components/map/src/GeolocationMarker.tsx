import { getGeolocation } from "@/helpers/locations"
import { Box, keyframes, useTheme } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { circle } from "@turf/turf"
import { Layer, Marker, Source } from "react-map-gl/maplibre"

interface GeolocationMarkerProps {
  onClick?: () => void
}

export default function GeolocationMarker({ onClick }: GeolocationMarkerProps) {
  const theme = useTheme()

  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: getGeolocation,
    retry: false,
  })

  const color = theme.palette.primary.main
  const sourceId = `accuracy-circle-${color}`
  const fillLayerId = `accuracy-circle-fill-${color}`
  const outlineLayerId = `accuracy-circle-outline-${color}`

  const pulse = keyframes`
    0% {
      transform: scale(0.75);
      opacity: 0;
    }
    50% {
      opacity: 0.75;
    }
    100% {
      transform: scale(1.25);
      opacity: 0;
    }
  `

  if (userGeolocation) {
    const { longitude, latitude, accuracy } = userGeolocation.coords
    return (
      <>
        <Marker
          longitude={longitude}
          latitude={latitude}
          style={{ cursor: "pointer" }}
          onClick={onClick}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: color,
              border: "2px solid white",
              boxShadow: `0px 0px 10px ${color}`,
            }}
          >
            <Box
              sx={{
                position: "relative",
                left: -10,
                top: -10,
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: `2px solid ${color}`,
                animation: `${pulse} 1.5s infinite ease-in-out`,
              }}
            />
          </Box>
        </Marker>
        {accuracy ? (
          <>
            <Source
              id={sourceId}
              type="geojson"
              data={circle([longitude, latitude], accuracy, {
                steps: 64,
                units: "meters",
              })}
            />
            <Layer
              id={fillLayerId}
              type="fill"
              source={sourceId}
              paint={{
                "fill-color": color,
                "fill-opacity": 0.2,
              }}
            />
            <Layer
              id={outlineLayerId}
              type="line"
              source={sourceId}
              paint={{
                "line-color": color,
                "line-width": 2,
              }}
            />
          </>
        ) : null}
      </>
    )
  }
}
